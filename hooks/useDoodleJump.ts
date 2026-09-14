import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
    Doodler, 
    Platform, 
    DoodlePlatformType, 
    DoodleMonster, 
    DoodleMonsterType,
    DoodleFallingObstacle, 
    DoodleFallingObstacleType, 
    DoodleProjectile,
    DoodleParticle,
    DoodleScorePopup
} from '../types';
import { doodleSound } from '../utils/soundDoodleJump';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 46;
const PLAYER_HEIGHT = 50;
const PLATFORM_HEIGHT = 16;
const PLATFORM_WIDTH_DEFAULT = 68;
const PLATFORM_COUNT = 7;

// Physics constants
const PLAYER_HORIZONTAL_ACCELERATION = 0.55;
const MAX_HORIZONTAL_SPEED = 5.5;
const FRICTION = 0.88;
const JUMP_BOOST_MULTIPLIER = 1.25;

let idCounter = 1;
const nextId = () => idCounter++;

export const useDoodleJump = () => {
    const gravity = 0.32;

    const [doodler, setDoodler] = useState<Doodler>({
        x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: GAME_HEIGHT - PLAYER_HEIGHT - 60,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        vy: 0,
        vx: 0,
        direction: 'right',
        isShooting: false,
    });

    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [monsters, setMonsters] = useState<DoodleMonster[]>([]);
    const [fallingObstacles, setFallingObstacles] = useState<DoodleFallingObstacle[]>([]);
    const [projectiles, setProjectiles] = useState<DoodleProjectile[]>([]);
    const [particles, setParticles] = useState<DoodleParticle[]>([]);
    const [scorePopups, setScorePopups] = useState<DoodleScorePopup[]>([]);

    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(true);
    const [totalScroll, setTotalScroll] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const leftPressed = useRef(false);
    const rightPressed = useRef(false);
    const jumpHeld = useRef(false);
    const lastShotTime = useRef(0);
    const shootResetTimeout = useRef<NodeJS.Timeout | null>(null);
    const nextObstacleSpawnScore = useRef(1500);

    const gameLoopRef = useRef<number | undefined>(undefined);
    
    const doodlerRef = useRef(doodler);
    useEffect(() => { doodlerRef.current = doodler; }, [doodler]);
    const platformsRef = useRef(platforms);
    useEffect(() => { platformsRef.current = platforms; }, [platforms]);
    const monstersRef = useRef(monsters);
    useEffect(() => { monstersRef.current = monsters; }, [monsters]);
    const fallingObstaclesRef = useRef(fallingObstacles);
    useEffect(() => { fallingObstaclesRef.current = fallingObstacles; }, [fallingObstacles]);
    const projectilesRef = useRef(projectiles);
    useEffect(() => { projectilesRef.current = projectiles; }, [projectiles]);
    const particlesRef = useRef(particles);
    useEffect(() => { particlesRef.current = particles; }, [particles]);
    const scorePopupsRef = useRef(scorePopups);
    useEffect(() => { scorePopupsRef.current = scorePopups; }, [scorePopups]);
    const scoreRef = useRef(score);
    useEffect(() => { scoreRef.current = score; }, [score]);
    const isGameOverRef = useRef(isGameOver);
    useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
    const isPausedRef = useRef(isPaused);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    // Calculate level and difficulty settings
    const getDifficultySettings = (currentScore: number) => {
        const baseJumpForce = -10.8;
        
        if (currentScore > 10000) { // Level 5
            return {
                level: 5,
                platformWidth: 46,
                minGap: 85,
                maxGap: 165,
                scoreMultiplier: 1.6,
                jumpForce: baseJumpForce - 1.0,
                monsterRate: 0.32,
                obstacleInterval: 280, // frames (~4.5s)
            };
        }
        if (currentScore > 6000) { // Level 4
            return {
                level: 4,
                platformWidth: 50,
                minGap: 80,
                maxGap: 155,
                scoreMultiplier: 1.4,
                jumpForce: baseJumpForce - 0.7,
                monsterRate: 0.26,
                obstacleInterval: 320,
            };
        }
        if (currentScore > 3000) { // Level 3
            return {
                level: 3,
                platformWidth: 56,
                minGap: 75,
                maxGap: 140,
                scoreMultiplier: 1.25,
                jumpForce: baseJumpForce - 0.4,
                monsterRate: 0.20,
                obstacleInterval: 380,
            };
        }
        if (currentScore > 1200) { // Level 2
            return {
                level: 2,
                platformWidth: 62,
                minGap: 70,
                maxGap: 125,
                scoreMultiplier: 1.1,
                jumpForce: baseJumpForce,
                monsterRate: 0.14,
                obstacleInterval: 440,
            };
        }
        return { // Level 1 (Tutorial / Classic notebook)
            level: 1,
            platformWidth: PLATFORM_WIDTH_DEFAULT,
            minGap: 62,
            maxGap: 110,
            scoreMultiplier: 1.0,
            jumpForce: baseJumpForce + 1.2,
            monsterRate: 0,
            obstacleInterval: 99999,
        };
    };

    // Spawn explosion / burst particles
    const spawnParticles = useCallback((x: number, y: number, color: string, count = 10) => {
        const newParticles: DoodleParticle[] = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            newParticles.push({
                id: nextId(),
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                color,
                size: 3 + Math.random() * 4,
                life: 1,
                maxLife: 20 + Math.random() * 15,
            });
        }
        setParticles(prev => [...prev.slice(-40), ...newParticles]);
    }, []);

    // Floating score popup text
    const spawnScorePopup = useCallback((x: number, y: number, points: number) => {
        setScorePopups(prev => [
            ...prev.slice(-8),
            {
                id: nextId(),
                x,
                y,
                text: `+${points}`,
                color: points >= 500 ? '#facc15' : '#4ade80',
                life: 35,
            }
        ]);
        setScore(s => s + points);
    }, []);

    // Create initial safe platforms
    const createPlatforms = useCallback(() => {
        const newPlatforms: Platform[] = [];
        const { platformWidth } = getDifficultySettings(0);
        
        // Solid bottom starting platform
        newPlatforms.push({
            id: nextId(),
            x: GAME_WIDTH / 2 - platformWidth / 2,
            y: GAME_HEIGHT - 60,
            width: platformWidth,
            height: PLATFORM_HEIGHT,
            type: 'standard',
        });

        for (let i = 1; i < PLATFORM_COUNT; i++) {
            const hasSpring = i === 2 || (i > 3 && Math.random() < 0.25);
            newPlatforms.push({
                id: nextId(),
                x: Math.random() * (GAME_WIDTH - platformWidth - 20) + 10,
                y: GAME_HEIGHT - 80 * i - 70,
                width: platformWidth,
                height: PLATFORM_HEIGHT,
                type: 'standard',
                hasSpring,
            });
        }
        return newPlatforms;
    }, []);

    // Start a fresh game
    const startGame = useCallback(() => {
        setIsGameOver(false);
        setIsPaused(false);
        setScore(0);
        setLevel(1);
        setTotalScroll(0);
        setMonsters([]);
        setFallingObstacles([]);
        setProjectiles([]);
        setParticles([]);
        setScorePopups([]);
        nextObstacleSpawnScore.current = 1500;

        const initialPlatforms = createPlatforms();
        setPlatforms(initialPlatforms);

        const initialDifficulty = getDifficultySettings(0);
        setDoodler({
            x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: GAME_HEIGHT - PLAYER_HEIGHT - 80,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            vy: initialDifficulty.jumpForce,
            vx: 0,
            direction: 'right',
            isShooting: false,
        });

        doodleSound.playJump();
    }, [createPlatforms]);
    
    const togglePause = useCallback(() => {
        if (isGameOver) return;
        setIsPaused(p => !p);
    }, [isGameOver]);

    // Movement controls
    const moveLeft = () => {
        if (isPaused || isGameOver) return;
        leftPressed.current = true;
        rightPressed.current = false;
    };
    const moveRight = () => {
        if (isPaused || isGameOver) return;
        rightPressed.current = true;
        leftPressed.current = false;
    };
    const stopMoving = () => {
        leftPressed.current = false;
        rightPressed.current = false;
    };
    const holdJump = () => {
        if (isPaused || isGameOver) return;
        jumpHeld.current = true;
    };
    const releaseJump = () => {
        jumpHeld.current = false;
    };

    // SHOOTING ACTION (Like in original Doodle Jump)
    const shoot = useCallback((targetX?: number, targetY?: number) => {
        if (isGameOverRef.current || isPausedRef.current) return;
        const now = Date.now();
        // Cooldown between shots (150ms)
        if (now - lastShotTime.current < 140) return;
        lastShotTime.current = now;

        const d = doodlerRef.current;
        const startX = d.x + d.width * 0.48;
        const startY = d.y - 4;

        let vx = 0;
        let vy = -15;

        if (targetX !== undefined && targetY !== undefined) {
            const dx = targetX - startX;
            const dy = targetY - startY;
            const dist = Math.hypot(dx, dy) || 1;
            // Always ensure shot travels upwards
            const speed = 15;
            vx = (dx / dist) * speed;
            vy = Math.min(-7, (dy / dist) * speed);
        }

        // Spawn yellow pellet
        const newProj: DoodleProjectile = {
            id: nextId(),
            x: startX,
            y: startY,
            vx,
            vy,
            radius: 5,
        };

        setProjectiles(prev => [...prev, newProj]);

        // Trigger shooting snout animation on Doodler
        setDoodler(prev => ({
            ...prev,
            isShooting: true,
        }));

        if (shootResetTimeout.current) clearTimeout(shootResetTimeout.current);
        shootResetTimeout.current = setTimeout(() => {
            setDoodler(prev => ({ ...prev, isShooting: false }));
        }, 160);

        doodleSound.playShoot();
    }, []);

    // Main 60 FPS Game Loop
    const gameLoop = useCallback(() => {
        if (isGameOverRef.current || isPausedRef.current) return;

        let nextDoodler = { ...doodlerRef.current };
        let nextPlatforms = [...platformsRef.current];
        let nextMonsters = [...monstersRef.current];
        let nextFallingObstacles = [...fallingObstaclesRef.current];
        let nextProjectiles = [...projectilesRef.current];
        let nextParticles = [...particlesRef.current];
        let nextScorePopups = [...scorePopupsRef.current];
        let nextScore = scoreRef.current;

        const currentDifficulty = getDifficultySettings(nextScore);
        setLevel(currentDifficulty.level);

        // 1. Horizontal player movement & screen wrapping
        if (leftPressed.current) {
            nextDoodler.vx -= PLAYER_HORIZONTAL_ACCELERATION;
        } else if (rightPressed.current) {
            nextDoodler.vx += PLAYER_HORIZONTAL_ACCELERATION;
        } else {
            nextDoodler.vx *= FRICTION;
        }

        nextDoodler.vx = Math.max(-MAX_HORIZONTAL_SPEED, Math.min(MAX_HORIZONTAL_SPEED, nextDoodler.vx));
        
        if (nextDoodler.vx > 0.1) nextDoodler.direction = 'right';
        if (nextDoodler.vx < -0.1) nextDoodler.direction = 'left';

        if (!leftPressed.current && !rightPressed.current && Math.abs(nextDoodler.vx) < 0.1) {
            nextDoodler.vx = 0;
        }
        
        nextDoodler.x += nextDoodler.vx;

        // Wrap around screen left/right
        if (nextDoodler.x > GAME_WIDTH - 10) {
            nextDoodler.x = -PLAYER_WIDTH + 15;
        } else if (nextDoodler.x + PLAYER_WIDTH < 15) {
            nextDoodler.x = GAME_WIDTH - 10;
        }

        // 2. Vertical player movement & gravity
        nextDoodler.vy += gravity;
        nextDoodler.y += nextDoodler.vy;

        // 3. Platform movement & breaking animation
        nextPlatforms = nextPlatforms.map(p => {
            let updated = { ...p };
            if (updated.type === 'moving' && updated.vx) {
                updated.x += updated.vx;
                if (updated.x <= 5) {
                    updated.x = 5;
                    updated.vx = Math.abs(updated.vx);
                } else if (updated.x + updated.width >= GAME_WIDTH - 5) {
                    updated.x = GAME_WIDTH - 5 - updated.width;
                    updated.vx = -Math.abs(updated.vx);
                }
            }
            if (updated.broken) {
                updated.breakProgress = (updated.breakProgress || 0) + 0.12;
            }
            return updated;
        });

        // 4. Platform landing collision (only when falling downwards)
        if (nextDoodler.vy > 0) {
            for (let i = 0; i < nextPlatforms.length; i++) {
                const platform = nextPlatforms[i];
                if (platform.broken && (platform.breakProgress || 0) > 0.3) continue;

                const prevBottom = doodlerRef.current.y + PLAYER_HEIGHT;
                const nextBottom = nextDoodler.y + PLAYER_HEIGHT;
                const tolerance = 6;

                if (
                    prevBottom <= platform.y + tolerance &&
                    nextBottom >= platform.y &&
                    nextDoodler.x + PLAYER_WIDTH - 8 > platform.x &&
                    nextDoodler.x + 8 < platform.x + platform.width
                ) {
                    if (platform.type === 'broken') {
                        // Broken wooden platform cracks & breaks, no bounce!
                        platform.broken = true;
                        platform.breakProgress = 0.05;
                        doodleSound.playPlatformBreak();
                        spawnParticles(platform.x + platform.width / 2, platform.y, '#92400e', 6);
                        break;
                    }

                    if (platform.hasSpring) {
                        // Spring bounce
                        platform.springExtended = true;
                        nextDoodler.vy = -16.5;
                        nextDoodler.y = platform.y - PLAYER_HEIGHT;
                        doodleSound.playSpring();
                        spawnParticles(platform.x + platform.width / 2, platform.y, '#ef4444', 8);
                        break;
                    }

                    if (platform.hasTrampoline) {
                        // Trampoline bounce
                        nextDoodler.vy = -19.5;
                        nextDoodler.y = platform.y - PLAYER_HEIGHT;
                        doodleSound.playSpring();
                        spawnParticles(platform.x + platform.width / 2, platform.y, '#3b82f6', 10);
                        break;
                    }

                    if (platform.type === 'cloud') {
                        // Cloud platform poofs away upon bounce
                        spawnParticles(platform.x + platform.width / 2, platform.y, '#e2e8f0', 8);
                        nextPlatforms.splice(i, 1);
                    }

                    const boost = jumpHeld.current ? JUMP_BOOST_MULTIPLIER : 1;
                    nextDoodler.vy = currentDifficulty.jumpForce * boost;
                    nextDoodler.y = platform.y - PLAYER_HEIGHT;
                    doodleSound.playJump();
                    break;
                }
            }
        }

        // 5. Monster movement & interactions
        nextMonsters = nextMonsters.map(m => {
            const updated = { ...m };
            if (updated.type === 'cyclops') {
                updated.x += updated.vx;
                if (Math.abs(updated.x - updated.baseX) > 45) {
                    updated.vx *= -1;
                }
            }
            if (updated.floatOffset !== undefined) {
                updated.floatOffset = (updated.floatOffset + 0.08) % (Math.PI * 2);
            }
            return updated;
        });

        // Check player colliding with monsters
        for (const monster of nextMonsters) {
            if (!monster.alive) continue;

            const mY = monster.y + (monster.floatOffset ? Math.sin(monster.floatOffset) * 6 : 0);
            const playerBox = {
                left: nextDoodler.x + 8,
                right: nextDoodler.x + PLAYER_WIDTH - 8,
                top: nextDoodler.y + 8,
                bottom: nextDoodler.y + PLAYER_HEIGHT - 4,
            };
            const monsterBox = {
                left: monster.x + 4,
                right: monster.x + monster.width - 4,
                top: mY + 4,
                bottom: mY + monster.height - 4,
            };

            const overlap = (
                playerBox.left < monsterBox.right &&
                playerBox.right > monsterBox.left &&
                playerBox.top < monsterBox.bottom &&
                playerBox.bottom > monsterBox.top
            );

            if (overlap) {
                // Check if stomping on top of monster from above
                if (nextDoodler.vy > 0 && doodlerRef.current.y + PLAYER_HEIGHT <= mY + 16) {
                    monster.alive = false;
                    nextDoodler.vy = -13.5; // Stomp boost!
                    doodleSound.playMonsterHit();
                    spawnParticles(monster.x + monster.width / 2, mY + monster.height / 2, '#a855f7', 14);
                    spawnScorePopup(monster.x + monster.width / 2, mY, 300);
                } else {
                    // Touched monster -> Game Over!
                    doodleSound.playFallDeath();
                    setIsGameOver(true);
                    return;
                }
            }
        }

        // 6. Projectiles update & collision with monsters & falling obstacles
        const remainingProjectiles: DoodleProjectile[] = [];
        for (const proj of nextProjectiles) {
            proj.x += proj.vx;
            proj.y += proj.vy;

            // Remove if off screen
            if (proj.y < -20 || proj.x < -20 || proj.x > GAME_WIDTH + 20) continue;

            let hit = false;

            // Check hit against monsters
            for (const monster of nextMonsters) {
                if (!monster.alive) continue;
                const mY = monster.y + (monster.floatOffset ? Math.sin(monster.floatOffset) * 6 : 0);
                if (
                    proj.x > monster.x &&
                    proj.x < monster.x + monster.width &&
                    proj.y > mY &&
                    proj.y < mY + monster.height
                ) {
                    hit = true;
                    monster.alive = false;
                    const pts = monster.type === 'ufo' ? 500 : 200;
                    spawnParticles(monster.x + monster.width / 2, mY + monster.height / 2, '#ec4899', 12);
                    spawnScorePopup(monster.x + monster.width / 2, mY, pts);
                    doodleSound.playMonsterHit();
                    break;
                }
            }

            // Check hit against falling obstacles
            if (!hit) {
                for (const obs of nextFallingObstacles) {
                    if (!obs.active || obs.warningTimer > 0) continue;
                    if (
                        proj.x > obs.x &&
                        proj.x < obs.x + obs.width &&
                        proj.y > obs.y &&
                        proj.y < obs.y + obs.height
                    ) {
                        hit = true;
                        obs.active = false;
                        spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#f97316', 15);
                        spawnScorePopup(obs.x + obs.width / 2, obs.y, 300);
                        doodleSound.playMonsterHit();
                        break;
                    }
                }
            }

            if (!hit) {
                remainingProjectiles.push(proj);
            }
        }
        nextProjectiles = remainingProjectiles;

        // 7. Higher Level Falling Obstacles update & spawn
        // Spawn falling obstacle from top when score exceeds threshold
        if (nextScore >= nextObstacleSpawnScore.current && currentDifficulty.level >= 2) {
            nextObstacleSpawnScore.current = nextScore + 600 + Math.random() * 800;
            
            const types: DoodleFallingObstacleType[] = ['soccer_ball'];
            if (currentDifficulty.level >= 3) types.push('meteor');
            if (currentDifficulty.level >= 4) types.push('anvil', 'alien_egg');
            const chosenType = types[Math.floor(Math.random() * types.length)];

            const obsX = Math.random() * (GAME_WIDTH - 80) + 40;
            nextFallingObstacles.push({
                id: nextId(),
                x: obsX,
                y: -50,
                width: chosenType === 'soccer_ball' ? 36 : chosenType === 'meteor' ? 44 : 40,
                height: chosenType === 'soccer_ball' ? 36 : chosenType === 'meteor' ? 50 : 38,
                vy: 3.2 + Math.random() * 1.5 + currentDifficulty.level * 0.4,
                vx: (Math.random() - 0.5) * 1.2,
                type: chosenType,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 8,
                warningTimer: 45, // ~0.75s warning at top
                active: true,
            });
            doodleSound.playFallingWarning();
        }

        // Update falling obstacles
        const activeObstacles: DoodleFallingObstacle[] = [];
        for (const obs of nextFallingObstacles) {
            if (!obs.active) continue;

            if (obs.warningTimer > 0) {
                obs.warningTimer -= 1;
                activeObstacles.push(obs);
                continue;
            }

            // Plunge down with gravity and rotation
            obs.y += obs.vy;
            obs.x += obs.vx;
            obs.rotation += obs.rotationSpeed;

            // Collision with Doodler
            const obsBox = {
                left: obs.x + 4,
                right: obs.x + obs.width - 4,
                top: obs.y + 4,
                bottom: obs.y + obs.height - 4,
            };
            const playerBox = {
                left: nextDoodler.x + 8,
                right: nextDoodler.x + PLAYER_WIDTH - 8,
                top: nextDoodler.y + 8,
                bottom: nextDoodler.y + PLAYER_HEIGHT - 4,
            };

            const hitsDoodler = (
                playerBox.left < obsBox.right &&
                playerBox.right > obsBox.left &&
                playerBox.top < obsBox.bottom &&
                playerBox.bottom > obsBox.top
            );

            if (hitsDoodler) {
                // Crushed by falling obstacle -> Game Over!
                doodleSound.playFallDeath();
                setIsGameOver(true);
                return;
            }

            if (obs.y < GAME_HEIGHT + 60) {
                activeObstacles.push(obs);
            }
        }
        nextFallingObstacles = activeObstacles;

        // 8. Screen Scroll upward when player ascends above half-height
        let scrollOffset = 0;
        if (nextDoodler.y < GAME_HEIGHT / 2 && nextDoodler.vy < 0) {
            scrollOffset = (GAME_HEIGHT / 2) - nextDoodler.y;
            nextDoodler.y = GAME_HEIGHT / 2;
        }

        if (scrollOffset > 0) {
            const { scoreMultiplier, platformWidth, minGap, maxGap, monsterRate } = currentDifficulty;

            nextScore += Math.floor(scrollOffset * scoreMultiplier);
            setTotalScroll(prev => prev + scrollOffset);

            // Shift platforms down
            let highestPlatformY = GAME_HEIGHT;
            const scrolledPlatforms = nextPlatforms.map(p => {
                const newY = p.y + scrollOffset;
                if (newY < highestPlatformY) highestPlatformY = newY;
                return { ...p, y: newY };
            });

            // Filter out platforms that fell off bottom
            const visiblePlatforms = scrolledPlatforms.filter(p => p.y < GAME_HEIGHT + 20);

            // Shift monsters & falling obstacles down with camera
            nextMonsters = nextMonsters
                .map(m => ({ ...m, y: m.y + scrollOffset }))
                .filter(m => m.y < GAME_HEIGHT + 50 && m.alive);

            nextFallingObstacles = nextFallingObstacles
                .map(o => ({ ...o, y: o.warningTimer > 0 ? o.y : o.y + scrollOffset }))
                .filter(o => o.y < GAME_HEIGHT + 60);

            // Generate new platforms at the top
            while (visiblePlatforms.length < PLATFORM_COUNT) {
                const gap = minGap + Math.random() * (maxGap - minGap);
                const spawnY = highestPlatformY - gap;
                highestPlatformY = spawnY;

                // Determine platform type based on level
                let type: DoodlePlatformType = 'standard';
                const rand = Math.random();
                if (currentDifficulty.level >= 2 && rand < 0.22) {
                    type = 'moving';
                } else if (currentDifficulty.level >= 2 && rand < 0.36) {
                    type = 'broken';
                } else if (currentDifficulty.level >= 3 && rand < 0.46) {
                    type = 'cloud';
                }

                const hasSpring = type === 'standard' && Math.random() < 0.16;
                const hasTrampoline = type === 'standard' && !hasSpring && Math.random() < 0.08;

                const newPlat: Platform = {
                    id: nextId(),
                    x: Math.random() * (GAME_WIDTH - platformWidth - 20) + 10,
                    y: spawnY,
                    width: platformWidth,
                    height: PLATFORM_HEIGHT,
                    type,
                    vx: type === 'moving' ? (Math.random() > 0.5 ? 1.8 : -1.8) : undefined,
                    hasSpring,
                    hasTrampoline,
                };
                visiblePlatforms.push(newPlat);

                // Chance to spawn a monster near this platform
                if (Math.random() < monsterRate && visiblePlatforms.length > 2) {
                    const monsterTypes: DoodleMonsterType[] = ['spiky'];
                    if (currentDifficulty.level >= 3) monsterTypes.push('cyclops');
                    if (currentDifficulty.level >= 4) monsterTypes.push('ufo');
                    const mType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

                    const monsterX = Math.random() * (GAME_WIDTH - 60) + 20;
                    nextMonsters.push({
                        id: nextId(),
                        x: monsterX,
                        y: spawnY - 48,
                        width: mType === 'ufo' ? 56 : 46,
                        height: 46,
                        type: mType,
                        vx: mType === 'cyclops' ? 1.4 : 0,
                        baseX: monsterX,
                        alive: true,
                        floatOffset: Math.random() * Math.PI,
                    });
                }
            }
            nextPlatforms = visiblePlatforms;
        }

        // 9. Update particles & score popups
        nextParticles = nextParticles
            .map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.vy + 0.15,
                life: p.life + 1,
            }))
            .filter(p => p.life < p.maxLife);

        nextScorePopups = nextScorePopups
            .map(p => ({
                ...p,
                y: p.y - 1.2,
                life: p.life - 1,
            }))
            .filter(p => p.life > 0);

        // 10. Check fall death (falling below bottom of screen)
        if (nextDoodler.y > GAME_HEIGHT) {
            doodleSound.playFallDeath();
            setIsGameOver(true);
            return;
        }

        // Commit all states
        setDoodler(nextDoodler);
        setPlatforms(nextPlatforms);
        setMonsters(nextMonsters);
        setFallingObstacles(nextFallingObstacles);
        setProjectiles(nextProjectiles);
        setParticles(nextParticles);
        setScorePopups(nextScorePopups);
        setScore(nextScore);

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [spawnParticles, spawnScorePopup]);

    useEffect(() => {
        if (!isGameOver && !isPaused) {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [isGameOver, isPaused, gameLoop]);

    return {
        doodler,
        platforms,
        monsters,
        fallingObstacles,
        projectiles,
        particles,
        scorePopups,
        score,
        level,
        isGameOver,
        isPaused,
        totalScroll,
        gameWidth: GAME_WIDTH,
        gameHeight: GAME_HEIGHT,
        startGame,
        togglePause,
        moveLeft,
        moveRight,
        stopMoving,
        holdJump,
        releaseJump,
        shoot,
    };
};
