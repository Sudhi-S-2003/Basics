import { Injectable, NotFoundException, } from '@nestjs/common';
import { MessageDto, messageQueryDto } from "./interface/message";

@Injectable()
export class AppService {
  private lists: MessageDto[] = [];

  getMessage({ query }: { query: messageQueryDto }): MessageDto[] {
    if (!query || Object.keys(query).length === 0) {
      return this.lists;
    }

    const { id, search } = query;

    if (search) {
      return this.lists.filter(
        (item) =>
          item.message.toLowerCase() === search.toLowerCase() ||
          item.id.toLowerCase() === search.toLowerCase(),
      );
    }

    if (id) {
      return this.lists.filter((item) => item.id === id);
    }

    return this.lists;
  }

  private pickRandomValue(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const isCapital = Math.random() > 0.5;
    const randomValue = letters[Math.floor(Math.random() * letters.length)];
    return isCapital ? randomValue : randomValue.toLowerCase();
  }

  private pickRandomNumber(length: number = 1): string {
    const digits = "0123456789";
    let randomValue = "";
    for (let i = 0; i < length; i++) {
      randomValue += digits[Math.floor(Math.random() * digits.length)];
    }
    return randomValue;
  }

  generateId(): string {
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += this.pickRandomValue();
    }
    result += this.pickRandomNumber(4); // append 4 digits
    return result;
  }

  addRandomMessage({ message }: Omit<MessageDto, "id" | "createdAt">): MessageDto {
    if (!message) {
      throw new NotFoundException("message is Required")
    }
    const messageInstance: MessageDto = {
      message,
      createdAt: new Date(),
      id: this.generateId(), // ✅ now returns string
    };
    this.lists.push(messageInstance);
    return messageInstance;
  }
}
