import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/document.models';

@Component({
  selector: 'app-category-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-group.component.html',
  styleUrl: './category-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryGroupComponent {
  @Input({ required: true }) category!: Category;
  @Input() isExpanded = false;
  @Input() isLoading = false;
  @Output() expandClicked = new EventEmitter<void>();

  protected readonly toggleExpand = (): void => this.expandClicked.emit();
}
