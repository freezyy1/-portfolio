import { Injectable } from '@nestjs/common';
import { CatService } from '../cat/cat.service';

function tokenizeTemper(temper?: string): Set<string> {
  if (!temper) return new Set();
  return new Set(temper.toLowerCase().split(/[ ,/]+/).filter(Boolean));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter(x => b.has(x))).size;
  const uni = new Set([...a, ...b]).size || 1;
  return inter / uni;
}

function similarityScore(target: any, cand: any): number {
  let score = 0;
  if (target.origin && cand.origin && target.origin === cand.origin) score += 0.4;
  const jt = jaccard(tokenizeTemper(target.temperament), tokenizeTemper(cand.temperament));
  score += jt * 0.6;
  return score;
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Injectable()
export class GameService {
  constructor(private readonly catService: CatService) {}

  async getQuestion(difficulty: 'easy'|'medium'|'hard' = 'medium') {
    const cat = await this.catService.getRandomCatWithBreed();
    const allBreeds = await this.catService.getBreeds();

    const correct = cat.breeds[0];

    // количество вариантов ответа в зависимости от сложности
    const optionsTarget = difficulty === 'easy' ? 3 : (difficulty === 'hard' ? 6 : 4);
    const options = [correct];

    if (difficulty === 'hard') {
      // выбор кандидатов по сходству с правильным ответом
      const scored = allBreeds
        .filter((b: any) => b.id !== correct.id)
        .map((b: any) => ({ b, s: similarityScore(correct, b) }))
        .sort((x: any, y: any) => y.s - x.s);
      for (const cand of scored) {
        if (!options.find(b => b.id === cand.b.id)) {
          options.push(cand.b);
          if (options.length >= optionsTarget) break;
        }
      }
    } else {
      while (options.length < optionsTarget) {
        const breed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
        if (!options.find(b => b.id === breed.id)) {
          options.push(breed);
        }
      }
    }

    shuffle(options);

    const timePerQuestion =
      difficulty === 'easy' ? 20000 :
      (difficulty === 'hard' ? 10000 : 15000);

    return {
      image: cat.url,
      correct: correct.id,
      options: options.map(o => ({ id: o.id, name: o.name })),
      difficulty,
      timeMs: timePerQuestion,
      breedInfo: {
        name: correct.name,
        description: correct.description,
        origin: correct.origin,
        life_span: correct.life_span,
        temperament: correct.temperament,
      },
    };
  }
}
