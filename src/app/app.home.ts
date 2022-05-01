import { Component } from '@angular/core';
import { DataSetComponent} from './data-set/data-set.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.home.html',
  styleUrls: ['./app.home.css']
})
export class Home {
  title = 'FleetManager';
}
