'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  DiggerGrid,
  DiggerPlayerState,
  DiggerEnemyState,
  DiggerGoldState,
  DiggerBulletState,
  Direction,
  DiggerEmeraldState,
} from '../types';
import { useInterval } from './useInterval';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const TICK_RATE = 150; // Base speed of the game loop
const SPAWN_INTERVAL_TICKS = 70; // Approx 10.5 seconds
const PLAYER_SPAWN_SAFETY_RADIUS = 5;

const levelConfigs = [
  {
    level: 1,
    enemies: 2,
    hobbins: 0,
    enemySpeed: 2.5,
    emeralds: 8,
    goldBags: 3,
    fireCooldown: 1000,
    rocks: 5,
    tunnels: 3,
    tunnelLength: 15,
  },
  {
    level: 2,
    enemies: 3,
    hobbins: 0,
    enemySpeed: 2.2,
    emeralds: 8,
    goldBags: 4,
    fireCooldown: 900,
    rocks: 7,
    tunnels: 3,
    tunnelLength: 20,
  },
  {
    level: 3,
    enemies: 4,
    hobbins: 0,
    enemySpeed: 2.0,
    emeralds: 9,
    goldBags: 4,
    fireCooldown: 850,
    rocks: 10,
    tunnels: 4,
    tunnelLength: 20,
  },
  {
    level: 4,
    enemies: 3,
    hobbins: 1,
    enemySpeed: 2.0,
    emeralds: 9,
    goldBags: 5,
    fireCooldown: 800,
    rocks: 12,
    tunnels: 4,
    tunnelLength: 25,
  },
  {
    level: 5,
    enemies: 4,
    hobbins: 1,
    enemySpeed: 1.8,
    emeralds: 10,
    goldBags: 5,
    fireCooldown: 750,
    rocks: 15,
    tunnels: 5,
    tunnelLength: 25,
  },
  {
    level: 6,
    enemies: 3,
    hobbins: 2,
    enemySpeed: 1.8,
    emeralds: 10,
    goldBags: 6,
    fireCooldown: 700,
    rocks: 18,
    tunnels: 5,
    tunnelLength: 30,
  },
  {
    level: 7,
    enemies: 2,
    hobbins: 3,
    enemySpeed: 1.6,
    emeralds: 11,
    goldBags: 6,
    fireCooldown: 650,
    rocks: 20,
    tunnels: 6,
    tunnelLength: 30,
  },
  {
    level: 8,
    enemies: 0,
    hobbins: 5,
    enemySpeed: 1.5,
    emeralds: 12,
    goldBags: 7,
    fireCooldown: 600,
    rocks: 25,
    tunnels: 7,
    tunnelLength: 35,
  },
];

let nextId = 0;
const getNextId = () => nextId++;

// Seeded pseudo-random number generator for stable level layouts
const createSeededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

export const useDiggerGame = () => {
  const [grid, setGrid] = useState<DiggerGrid>([]);
  const [player, setPlayer] = useState<DiggerPlayerState>({
    x: 0,
    y: 0,
    direction: 'RIGHT',
  });
  const [enemies, setEnemies] = useState<DiggerEnemyState[]>([]);
  const [goldBags, setGoldBags] = useState<DiggerGoldState[]>([]);
  const [emeralds, setEmeralds] = useState<DiggerEmeraldState[]>([]);
  const [bullets, setBullets] = useState<DiggerBulletState[]>([]);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [gameMessage, setGameMessage] = useState('');

  const playerDirectionRef = useRef(player.direction);
  const lastFireTimeRef = useRef(0);
  const gameTickCounterRef = useRef(0);
  const enemyStateRef = useRef(enemies);
  const enemiesToSpawnRef = useRef<Array<'nobbin' | 'hobbin'>>([]);
  const lastSpawnTickRef = useRef(0);

  useEffect(() => {
    enemyStateRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    if (
      isGameOver &&
      (gameMessage === 'GAME OVER' || gameMessage.includes('WIN'))
    ) {
      if (score > highScore) {
        localStorage.setItem('digger_high_score', score.toString());
        setHighScore(score);
      }
    }
  }, [isGameOver, gameMessage, score, highScore]);

  const createEmptyGrid = (): DiggerGrid =>
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill('DIRT'));

  const startGame = useCallback(() => {
    setHighScore(
      parseInt(localStorage.getItem('digger_high_score') || '0', 10)
    );
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsGameOver(false);
    setIsPaused(false);
    setGameMessage('');
    generateLevel(1);
  }, []);

  const togglePause = useCallback(() => {
    if (isGameOver) return;
    setIsPaused((p) => !p);
  }, [isGameOver]);

  const generateLevel = useCallback(
    (levelNum: number) => {
      const config = levelConfigs[levelNum - 1];
      const seededRandom = createSeededRandom(levelNum);
      let newGrid = createEmptyGrid();

      for (let i = 0; i < config.tunnels; i++) {
        let x = Math.floor(seededRandom() * GRID_WIDTH);
        let y = Math.floor(seededRandom() * GRID_HEIGHT);
        for (let j = 0; j < config.tunnelLength; j++) {
          newGrid[y][x] = 'TUNNEL';
          const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
          const dir = dirs[Math.floor(seededRandom() * 4)];
          const nextPos = moveEntity(x, y, dir);
          x = Math.max(0, Math.min(GRID_WIDTH - 1, nextPos.x));
          y = Math.max(0, Math.min(GRID_HEIGHT - 1, nextPos.y));
        }
      }

      for (let i = 0; i < config.rocks; i++) {
        let x, y;
        do {
          x = Math.floor(seededRandom() * GRID_WIDTH);
          y = Math.floor(seededRandom() * GRID_HEIGHT);
        } while (newGrid[y][x] !== 'DIRT');
        newGrid[y][x] = 'ROCK';
      }

      const getValidPos = (type: 'TUNNEL' | 'DIRT' = 'DIRT') => {
        let x, y;
        let attempts = 0;
        do {
          x = Math.floor(seededRandom() * GRID_WIDTH);
          y = Math.floor(seededRandom() * GRID_HEIGHT);
          attempts++;
        } while (newGrid[y][x] !== type && attempts < 100);
        return { x, y };
      };

      const playerPos = getValidPos('TUNNEL');
      setPlayer({ ...player, ...playerPos });
      playerDirectionRef.current = 'RIGHT';
      newGrid[playerPos.y][playerPos.x] = 'TUNNEL';

      const newEmeralds: DiggerEmeraldState[] = [];
      for (let i = 0; i < config.emeralds; i++) {
        const pos = getValidPos('DIRT');
        newGrid[pos.y][pos.x] = 'EMERALD';
        newEmeralds.push(pos);
      }
      setEmeralds(newEmeralds);

      const newGoldBags: DiggerGoldState[] = [];
      for (let i = 0; i < config.goldBags; i++) {
        const pos = getValidPos('DIRT');
        newGoldBags.push({
          id: getNextId(),
          ...pos,
          isFalling: false,
          fallTimer: 0,
        });
      }
      setGoldBags(newGoldBags);

      const typesToSpawn = [
        ...Array(config.enemies).fill('nobbin'),
        ...Array(config.hobbins).fill('hobbin'),
      ];
      typesToSpawn.sort(() => seededRandom() - 0.5); // Shuffle
      enemiesToSpawnRef.current = typesToSpawn;
      lastSpawnTickRef.current = 0;
      setEnemies([]);

      setBullets([]);
      setGrid(newGrid);
      setLevel(levelNum);
      gameTickCounterRef.current = 0;
      setGameMessage(`LEVEL ${levelNum}`);
      setTimeout(() => setGameMessage(''), 1500);
    },
    [player]
  );

  const changeDirection = (dir: Direction) => {
    if (isPaused) return;
    playerDirectionRef.current = dir;
  };

  const fire = () => {
    if (isPaused) return;
    const now = Date.now();
    const config = levelConfigs[level - 1];
    if (now - lastFireTimeRef.current > config.fireCooldown) {
      lastFireTimeRef.current = now;
      setBullets((prev) => [
        ...prev,
        {
          id: getNextId(),
          x: player.x,
          y: player.y,
          direction: player.direction,
        },
      ]);
    }
  };

  const moveEntity = (x: number, y: number, dir: Direction) => {
    switch (dir) {
      case 'UP':
        y--;
        break;
      case 'DOWN':
        y++;
        break;
      case 'LEFT':
        x--;
        break;
      case 'RIGHT':
        x++;
        break;
    }
    return { x, y };
  };

  const gameLoop = useCallback(() => {
    if (isGameOver) return;
    gameTickCounterRef.current++;

    if (
      enemiesToSpawnRef.current.length > 0 &&
      gameTickCounterRef.current - lastSpawnTickRef.current >
        SPAWN_INTERVAL_TICKS
    ) {
      const tunnelCells: { x: number; y: number }[] = [];
      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 'TUNNEL') {
            const distance = Math.abs(player.x - x) + Math.abs(player.y - y);
            if (distance > PLAYER_SPAWN_SAFETY_RADIUS) {
              tunnelCells.push({ x, y });
            }
          }
        });
      });

      if (tunnelCells.length > 0) {
        const spawnPos =
          tunnelCells[Math.floor(Math.random() * tunnelCells.length)];
        const typeToSpawn = enemiesToSpawnRef.current.pop();

        if (typeToSpawn) {
          const newEnemy: DiggerEnemyState = {
            id: getNextId(),
            ...spawnPos,
            direction: 'RIGHT',
            type: typeToSpawn,
            isSpawning: true,
          };
          setEnemies((prev) => [...prev, newEnemy]);
          lastSpawnTickRef.current = gameTickCounterRef.current;
        }
      }
    }

    // Compute next player position once and reuse it so we only collect an emerald once per move
    const nextPlayerPos = moveEntity(
      player.x,
      player.y,
      playerDirectionRef.current
    );
    const canMoveToNext =
      !(
        nextPlayerPos.x < 0 ||
        nextPlayerPos.x >= GRID_WIDTH ||
        nextPlayerPos.y < 0 ||
        nextPlayerPos.y >= GRID_HEIGHT
      ) &&
      grid[nextPlayerPos.y]?.[nextPlayerPos.x] !== 'ROCK' &&
      !goldBags.some(
        (bag) =>
          bag.x === nextPlayerPos.x &&
          bag.y === nextPlayerPos.y &&
          !bag.isFalling
      );

    setPlayer((p) =>
      canMoveToNext
        ? { ...nextPlayerPos, direction: playerDirectionRef.current }
        : p
    );

    if (canMoveToNext) {
      setGrid((g) => {
        const newGrid = g.map((row) => [...row]);
        const cell = newGrid[nextPlayerPos.y][nextPlayerPos.x];
        if (cell === 'DIRT' || cell === 'EMERALD') {
          if (cell === 'EMERALD') {
            setScore((s) => s + 25);
            setEmeralds((prev) =>
              prev.filter(
                (em) => em.x !== nextPlayerPos.x || em.y !== nextPlayerPos.y
              )
            );
          }
          newGrid[nextPlayerPos.y][nextPlayerPos.x] = 'TUNNEL';
        }
        return newGrid;
      });
    }

    setBullets((prev) => {
      const nextBullets = prev.map((b) => ({
        ...b,
        ...moveEntity(b.x, b.y, b.direction),
      }));
      return nextBullets.filter(
        (b) =>
          b.x >= 0 &&
          b.x < GRID_WIDTH &&
          b.y >= 0 &&
          b.y < GRID_HEIGHT &&
          grid[b.y]?.[b.x] !== 'DIRT' &&
          grid[b.y]?.[b.x] !== 'ROCK'
      );
    });

    setGoldBags(
      (bags) =>
        bags
          .map((bag) => {
            if (bag.isFalling) {
              const nextY = bag.y + 1;
              if (
                nextY >= GRID_HEIGHT ||
                grid[nextY]?.[bag.x] === 'ROCK' ||
                grid[nextY]?.[bag.x] === 'DIRT' ||
                grid[nextY]?.[bag.x] === 'EMERALD'
              ) {
                setGrid((g) => {
                  const newGrid = g.map((r) => [...r]);
                  for (let i = -1; i <= 1; i++) {
                    if (bag.x + i >= 0 && bag.x + i < GRID_WIDTH) {
                      newGrid[bag.y][bag.x + i] = 'GOLD';
                    }
                  }
                  return newGrid;
                });
                return null;
              }
              return { ...bag, y: nextY };
            } else {
              if (
                bag.y + 1 < GRID_HEIGHT &&
                grid[bag.y + 1]?.[bag.x] === 'TUNNEL'
              ) {
                const playerBlocking =
                  player.x === bag.x && player.y === bag.y + 1;
                if (!playerBlocking) {
                  return { ...bag, fallTimer: bag.fallTimer + 1 };
                }
              }

              if (bag.fallTimer > 2) {
                return { ...bag, isFalling: true, fallTimer: 0 };
              }
              return { ...bag, fallTimer: 0 };
            }
          })
          .filter(Boolean) as DiggerGoldState[]
    );

    if (grid[player.y][player.x] === 'GOLD') {
      setScore((s) => s + 50);
      setGrid((g) => {
        const newGrid = g.map((r) => [...r]);
        newGrid[player.y][player.x] = 'TUNNEL';
        return newGrid;
      });
    }

    const config = levelConfigs[level - 1];
    if (gameTickCounterRef.current % Math.round(config.enemySpeed) === 0) {
      const newEnemies = enemies.map((enemy) => {
        if (enemy.isSpawning) return { ...enemy, isSpawning: false };

        const validMoves: Direction[] = [];
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        directions.forEach((dir) => {
          const next = moveEntity(enemy.x, enemy.y, dir);
          if (
            next.x >= 0 &&
            next.x < GRID_WIDTH &&
            next.y >= 0 &&
            next.y < GRID_HEIGHT
          ) {
            const cell = grid[next.y][next.x];
            if (
              cell === 'TUNNEL' ||
              cell === 'GOLD' ||
              (enemy.type === 'hobbin' &&
                (cell === 'DIRT' || cell === 'EMERALD'))
            ) {
              validMoves.push(dir);
            }
          }
        });

        let newDirection = enemy.direction;
        if (validMoves.length > 2 || !validMoves.includes(enemy.direction)) {
          if (validMoves.length > 0) {
            newDirection =
              validMoves[Math.floor(Math.random() * validMoves.length)];
          }
        }

        const nextPos = moveEntity(enemy.x, enemy.y, newDirection);
        const canMove =
          nextPos.x >= 0 &&
          nextPos.x < GRID_WIDTH &&
          nextPos.y >= 0 &&
          nextPos.y < GRID_HEIGHT;

        if (canMove) {
          const nextCell = grid[nextPos.y]?.[nextPos.x];
          if (
            enemy.type === 'hobbin' &&
            (nextCell === 'DIRT' || nextCell === 'EMERALD')
          ) {
            if (nextCell === 'EMERALD') {
              setEmeralds((prev) =>
                prev.filter((em) => em.x !== nextPos.x || em.y !== nextPos.y)
              );
            }
            setGrid((g) => {
              const newGrid = g.map((r) => [...r]);
              newGrid[nextPos.y][nextPos.x] = 'TUNNEL';
              return newGrid;
            });
          }
          return { ...enemy, ...nextPos, direction: newDirection };
        }
        return enemy;
      });
      setEnemies(newEnemies);
    }

    const bulletsToRemove = new Set<number>();
    const enemiesToRemove = new Set<number>();

    bullets.forEach((bullet) => {
      enemies.forEach((enemy) => {
        if (bullet.x === enemy.x && bullet.y === enemy.y) {
          bulletsToRemove.add(bullet.id);
          enemiesToRemove.add(enemy.id);
          setScore((s) => s + 100);
        }
      });
    });

    if (bulletsToRemove.size > 0 || enemiesToRemove.size > 0) {
      setBullets((b) => b.filter((bullet) => !bulletsToRemove.has(bullet.id)));
      setEnemies((e) => e.filter((enemy) => !enemiesToRemove.has(enemy.id)));
    }

    const resetPlayer = () => {
      setLives((l) => {
        if (l - 1 <= 0) {
          setIsGameOver(true);
          setGameMessage('GAME OVER');
          return 0;
        }
        const respawnPos = {
          x: Math.floor(GRID_WIDTH / 2),
          y: Math.floor(GRID_HEIGHT / 2),
        };
        setPlayer((p) => ({ ...p, x: respawnPos.x, y: respawnPos.y }));
        setGrid((g) => {
          const newGrid = g.map((r) => [...r]);
          if (newGrid[respawnPos.y][respawnPos.x] !== 'ROCK') {
            newGrid[respawnPos.y][respawnPos.x] = 'TUNNEL';
          }
          return newGrid;
        });
        return l - 1;
      });
    };

    enemyStateRef.current.forEach((enemy) => {
      if (player.x === enemy.x && player.y === enemy.y) {
        resetPlayer();
      }
    });

    goldBags.forEach((bag) => {
      if (bag.isFalling) {
        if (bag.x === player.x && bag.y === player.y) {
          resetPlayer();
        }
        enemyStateRef.current.forEach((enemy) => {
          if (bag.x === enemy.x && bag.y === enemy.y) {
            setEnemies((e) => e.filter((e_) => e_.id !== enemy.id));
            setGoldBags((b) => b.filter((b_) => b_.id !== bag.id));
            setScore((s) => s + 250);
            setGrid((g) => {
              const newGrid = g.map((r) => [...r]);
              newGrid[bag.y][bag.x] = 'GOLD';
              return newGrid;
            });
          }
        });
      }
    });
  }, [
    isGameOver,
    player,
    grid,
    goldBags,
    bullets,
    level,
    score,
    highScore,
    generateLevel,
  ]);

  useInterval(gameLoop, isGameOver || isPaused ? null : TICK_RATE);

  // Advance level (or win) when emeralds are all collected.
  useEffect(() => {
    if (isGameOver) return;
    if (emeralds.length === 0) {
      enemiesToSpawnRef.current = [];
      setEnemies([]);
      if (level + 1 > levelConfigs.length) {
        setIsGameOver(true);
        setGameMessage('YOU WIN!');
      } else {
        // Slight timeout so the UI can show the last collection before switching levels
        setTimeout(() => generateLevel(level + 1), 150);
      }
    }
  }, [emeralds, isGameOver, level, generateLevel]);

  return {
    grid,
    player,
    enemies,
    goldBags,
    bullets,
    score,
    highScore,
    lives,
    level,
    emeraldsRemaining: emeralds.length,
    isGameOver,
    isPaused,
    gameMessage,
    startGame,
    changeDirection,
    fire,
    togglePause,
  };
};
