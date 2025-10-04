import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CatService {
  private readonly API_URL = 'https://api.thecatapi.com/v1';
  constructor(private readonly http: HttpService) {}

  private headers() {
    const key = process.env.CAT_API_KEY || '';
    return key ? { 'x-api-key': key } : {};
  }

  async getRandomCatWithBreed() {
    const res = await this.http.axiosRef.get(`${this.API_URL}/images/search`, {
      headers: this.headers(),
      params: { has_breeds: 1, size: 'med' },
    });
    if (!res.data || !res.data[0] || !res.data[0].breeds || !res.data[0].breeds[0]) {
      throw new Error('Не удалось получить кота с породой');
    }
    return res.data[0];
  }

  async getBreeds() {
    const res = await this.http.axiosRef.get(`${this.API_URL}/breeds`, {
      headers: this.headers(),
    });
    return res.data;
  }
}
