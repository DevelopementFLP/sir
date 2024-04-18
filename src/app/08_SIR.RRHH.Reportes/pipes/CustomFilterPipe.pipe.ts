import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customFilter'
})

export class CustomFilter implements PipeTransform {
    transform(items: string[], searcText: string): string[] {
        if(!items) return [];
        if(!searcText) return items;
        searcText = searcText.toLocaleLowerCase();
        return items.filter(item => item.toLocaleLowerCase().includes(searcText));
    }
}