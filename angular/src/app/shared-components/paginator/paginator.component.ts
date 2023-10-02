import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  standalone: true,
  imports: [MatPaginatorModule]
})
export class PaginatorComponent {
  pageSizeOptions: number[] = [5, 10, 15, 20]
  @Input({ required: true }) length!: number;

  @Output() pageChanged: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event)
  }
}
