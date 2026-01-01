import { Component, OnInit, OnDestroy } from '@angular/core';
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
  sensorData: any = { temp: 20, pressure: 5 };
  lastUpdated: string = 'Never';
  error: string | null = null;

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
          this.sensorData = data;
          this.lastUpdated = new Date().toLocaleTimeString();
          this.error = null;
        })
        .catch(err => {
          console.error('Sensor Fetch Error:', err);
          this.error = 'Connection lost. Retrying...';
        });
    }, 2000);
  }

  ngOnDestroy() {
    if (this.pollingId) clearInterval(this.pollingId);
  }
}
