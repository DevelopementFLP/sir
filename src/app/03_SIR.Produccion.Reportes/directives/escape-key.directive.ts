import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[escapeKey]'
})
export class EscapeKeyDirective {

  @Output() escapePressed = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    event.preventDefault();
    this.escapePressed.emit();
  }

}
