import {Component, OnInit, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";

import {GeoDbService} from "../../client/geodb.service";
import {CitySummary} from "../../client/model/city-summary.model";
import {Country} from "../../client/model/country.model";
import {GeoResponse} from "../../client/model/geo-response.model";
import {NearLocationRequest} from "../../client/model/near-location.request";

import {CountryControlComponent} from "../../common/components/country-control/country-control.component";

import {RestConstants} from "../../common/rest-constants.class";

@Component({
  selector: "app-search-cities-component",
  templateUrl: "./find-cities.component.html",
  styleUrls: ["./find-cities.component.css"]
})
export class FindCitiesComponent implements OnInit {

  readonly CITY_RESULTS_COLUMNS_NO_COUNTRY = [{name: "ID"}, {name: "CitySummary"}, {name: "Region"}];
  readonly CITY_RESULTS_COLUMNS = [...this.CITY_RESULTS_COLUMNS_NO_COUNTRY, {name: "Country"}];

  @ViewChild("countryControl")
  countryControlComponent: CountryControlComponent;

  countryCode: string;

  cityControl: FormControl;
  minPopulationControl: FormControl;

  cityResultsColumns = [];
  cityResultsCurrent = new Array<CitySummary>();
  cityResultsTotalCount = 0;
  cityResultsCurrentPage = 0;
  cityResultsPageSize = RestConstants.MAX_PAGING_LIMIT;

  nearLocationLatitudeControl: FormControl;
  nearLocationLongitudeControl: FormControl;
  nearLocationRadius: FormControl;

  nearLocationControlsDisabled: boolean;

  constructor(private geoDbService: GeoDbService) { }

  ngOnInit() {
    this.cityControl = new FormControl();
    this.cityControl.disable();

    this.minPopulationControl = new FormControl();
    this.minPopulationControl.disable();

    this.nearLocationLatitudeControl = new FormControl();
    this.nearLocationLongitudeControl = new FormControl();
    this.nearLocationRadius = new FormControl();

    this.disableNearLocationControls();

    this.updateResults();
  }

  disableNearLocationControls() {
    this.nearLocationLatitudeControl.disable();
    this.nearLocationLongitudeControl.disable();
    this.nearLocationRadius.disable();
    this.nearLocationControlsDisabled = true;
  }

  enableNearLocationControls() {
    this.nearLocationLatitudeControl.enable();
    this.nearLocationLongitudeControl.enable();
    this.nearLocationRadius.enable();
    this.nearLocationControlsDisabled = false;

    this.countryControlComponent.disable();
  }

  onCountryCodeSelected(countryCode: string) {
    this.countryCode = countryCode;
  }

  onCountryControlEnabled(enabled: boolean) {
    if (!enabled) {
      this.countryCode = null;
    } else {
      this.disableNearLocationControls();
    }
  }

  setCityResultsPage(page: number) {
    this.cityResultsCurrentPage = page;

    const offset = page * this.cityResultsPageSize;

    const namePrefix = this.cityControl.enabled ? this.cityControl.value : null;
    const minPopulation = this.minPopulationControl.enabled ? this.minPopulationControl.value : null;

    this.cityResultsColumns = this.CITY_RESULTS_COLUMNS;

    if (this.nearLocationControlsDisabled) {
      if (this.countryCode) {
        this.cityResultsColumns = this.CITY_RESULTS_COLUMNS_NO_COUNTRY;
      }

      this.geoDbService.findCities(namePrefix, this.countryCode, minPopulation, this.cityResultsPageSize, offset)
        .retry(RestConstants.MAX_RETRY)
        .subscribe(
          (response: GeoResponse<CitySummary[]>) => {
            this.cityResultsTotalCount = response.metadata.totalCount;

            this.cityResultsCurrent = [...response.data];
          });
    } else {
      const nearLocationRequest: NearLocationRequest = {
        latitude: this.nearLocationLatitudeControl.value,
        longitude: this.nearLocationLongitudeControl.value,
        radius: this.nearLocationRadius.value
      };

      console.log("near location request: " + JSON.stringify(nearLocationRequest));

      this.geoDbService.findCitiesNearLocation(nearLocationRequest, namePrefix, minPopulation, this.cityResultsPageSize, offset)
        .retry(RestConstants.MAX_RETRY)
        .subscribe(
          (response: GeoResponse<CitySummary[]>) => {
            this.cityResultsTotalCount = response.metadata.totalCount;

            this.cityResultsCurrent = [...response.data];
          });
    }
  }

  updateResults() {
    this.setCityResultsPage(0);
  }
}
