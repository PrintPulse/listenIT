import '@testing-library/jest-dom';

class TextEncoderPolyfill implements TextEncoder {
   readonly encoding: string = 'utf-8';
   encode(input: string): Uint8Array {
     // Используем Buffer для конвертации строки в Uint8Array
     return new Uint8Array(Buffer.from(input, 'utf-8'));
   }
   encodeInto(input: string, dest: Uint8Array): { read: number; written: number } {
     const encoded = this.encode(input);
     const written = Math.min(dest.length, encoded.length);
     dest.set(encoded.subarray(0, written));
     return { read: input.length, written };
   }
 }
 // Присваиваем полифил глобальному объекту
 global.TextEncoder = TextEncoderPolyfill as any;