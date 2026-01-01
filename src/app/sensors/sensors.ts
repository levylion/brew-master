import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensors.html',
  styleUrl: './sensors.scss',
})
export class SensorsComponent implements OnInit, OnDestroy {
  pollingId: any;
  sensorData = signal<any>({ temp: 20, pressure: 5 });
  lastUpdated = signal<string>('Never');
  error = signal<string | null>(null);

  ngOnInit() {
    // BUG: Network Polling 404
    // Continually trying to fetch data from a non-existent endpoint
    this.startPolling();
  }

  startPolling() {
    this.pollingId = setInterval(() => {
      fetch('/api/sensors/data.json')
        .then(response => {
          if (!response.ok) throw new Error('Sensor API unreachable');
          return response.json();
        })
        .then(data => {
          this.sensorData.set(data);
          this.lastUpdated.set(new Date().toLocaleTimeString());
          this.error.set(null);
        })
        .catch(err => {
          console.error('Sensor Fetch Error:', err);
          this.error.set('Connection lost. Retrying...');
        });
    }, 2000);
  }

  ngOnDestroy() {
    if (this.pollingId) clearInterval(this.pollingId);
  }
}
