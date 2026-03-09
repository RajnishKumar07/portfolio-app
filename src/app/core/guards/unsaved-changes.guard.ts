import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (!component.canDeactivate()) {
    return window.confirm('You have unsaved changes! Are you sure you want to leave this page? Your progress will be lost.');
  }
  return true;
};
