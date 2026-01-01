import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
  // BUG: OnPush Change Detection
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('autoRefreshToggle') autoRefreshToggle!: ElementRef;
  items: string[] = ['25kg Pale Malt', '10kg Wheat Malt', '5kg Crystal 60L'];
  intervalId: any;
  lastAdded: string = 'None';
  autoRefreshEnabled: boolean = false;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.startRestocking();
  }

  ngAfterViewInit() {
    // TRAP: We bind the event MANUALLY outside of Angular's zone.
    // This ensures that clicking the toggle does NOT trigger Change Detection.
    // The checkbox will visually toggle (native browser behavior), but the 
    // component view (the items list) will NOT update.
    this.ngZone.runOutsideAngular(() => {
      this.autoRefreshToggle.nativeElement.addEventListener('change', () => {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        console.log('Auto Refresh Toggled (Outside Zone):', this.autoRefreshEnabled);
      });
    });
  }

  startRestocking() {
    // Simulate incoming stock every 3 seconds
    this.intervalId = setInterval(() => {
      const newItem = `Hop Pellets (Batch #${Math.floor(Math.random() * 9000) + 1000})`;

      // BUG: Array Mutation
      // We are mutating the array directly instead of creating a new reference.
      // With OnPush, Angular only checks for changes if the Input reference changes 
      // or an event is triggered *inside* the component.
      // Since this is an async callback (setInterval) and we just mutate the array,
      // the view will NOT update automatically.
      this.items.push(newItem);
      this.lastAdded = newItem; // This property mutation is also ignored

      console.log('Stock received:', newItem, '(View might not update)');
    }, 3000);
  }

  // Workaround button to force check (for demo)
  forceUpdate() {
    // This event handler will trigger change detection cycle
    console.log('Manual update triggered');
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
