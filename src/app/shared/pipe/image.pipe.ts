import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
  standalone: false
})
export class ImagePipe implements PipeTransform {

  transform(value: string | null, fallback: string = '/images/no-image.png'): string {
    return value && value.trim() !== '' ? value : fallback;
  }

}
