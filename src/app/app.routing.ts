import {Routes} from '@angular/router';

import {AutosuggestCitiesComponent} from './components/autosuggest-cities/autosuggest-cities.component';

export const APP_ROUTES: Routes = [
  {path: '', component: AutosuggestCitiesComponent, pathMatch: 'full'},
];
