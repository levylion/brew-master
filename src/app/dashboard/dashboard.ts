import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  // No ViewChild needed for memory leak

  // BUG: Memory Leak (Unbounded Array)
  // We will push data here endlessly
  leakyData: any[] = [];

  batches = [
    { name: 'Golden Ale', status: 'Fermenting', date: '2023-10-25', icon: '🍺' },
    { name: 'Imperial Stout', status: 'Aging', date: '2023-10-10', icon: '⚫' },
    { name: 'Hazy IPA', status: 'Boiling', date: 'Today', icon: '🌫️' }
  ];

  ngOnInit() {
    // BUG: RxJS Memory Leak
    // We subscribe to an interval but NEVER unsubscribe (no takeUntil, no async pipe, no unsubscribe in ngOnDestroy)
    // Every 10ms we push a relatively large object to the array.
    interval(20).subscribe(() => {
      // Create a dummy object to consume memory
      const metric = {
        timestamp: new Date(),
        id: Math.random(),
        data: new Array(1000).fill('x').join(''), // ~1KB string
        overhead: document.createElement('div') // Detached DOM node reference
      };

      this.leakyData.push(metric);

      // Make the leak "discoverable" for the agent via Console
      if (this.leakyData.length % 200 === 0) {
        console.warn(`[System Alert] Memory usage rising rapidly! ${this.leakyData.length} unoptimized metrics in memory.`);
      }

      // Force a GC pressure warning occasionally
      if (this.leakyData.length % 1000 === 0) {
        console.error('[Critical] Potential Memory Leak detected in DashboardComponent. Heap limit approaching.');
      }

      // Log occasionally so we see it's alive
      if (this.leakyData.length % 500 === 0) {
        console.log(`[Memory Leak] Array size: ${this.leakyData.length} objects`);
      }
    });
  }

  // BUG: Missing ngOnDestroy cleanup
  // ngOnDestroy() { 
  //   /* We intentionally do not unsubscribe here! */ 
  // }
}
