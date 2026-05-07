import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MenuItemId = 'documents' | 'create' | 'shared' | 'settings';

export interface MenuItem {
  id: MenuItemId;
  label: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() activeMenuId: MenuItemId = 'documents';
  @Output() menuChanged = new EventEmitter<MenuItemId>();

  protected readonly menuItems: MenuItem[] = [
    {
      id: 'documents',
      label: 'My Documents',
      icon: '📁',
      description: 'View and manage your documents'
    },
    {
      id: 'create',
      label: 'Create',
      icon: '➕',
      description: 'Create new document or category'
    },
    {
      id: 'shared',
      label: "Others' Documents",
      icon: '🔗',
      description: "View documents shared with you"
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'Manage your preferences'
    }
  ];

  protected readonly selectMenuItem = (id: MenuItemId): void => {
    this.menuChanged.emit(id);
  };

  protected readonly isActive = (id: MenuItemId): boolean => {
    return this.activeMenuId === id;
  };
}
