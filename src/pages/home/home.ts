import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { LoadingController, AlertController, ModalController, NavController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/rx';
import { MapComponent } from '../../components/map';
import { MapService } from '../../providers/map-service';
import { GeocoderService } from '../../providers/geocoder';
import { AuthService } from '../../providers/auth-service';

 
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  localized: boolean = false;
  constructor(public navCtrl: NavController, private geocoderService: GeocoderService, public loadingCtrl: LoadingController,
   private platform: Platform, private mapService: MapService, private auth: AuthService) {

  }


	onMapReady(): Promise<any> {
	  // I must wait platform.ready() to use plugins ( in this case Geolocation plugin ).
	  return this.platform.ready().then(() => {
	    return this.locate().then(() => {
	      const mapElement: Element = this.mapService.mapElement;
	      if (mapElement) {
	        mapElement.classList.add('show-map');
	        this.mapService.resizeMap();
	      }
	    });
	  });
	}

	/***
	 * This event is fired when the user starts dragging the map.
	 */
	onDragStart(): void {
	  this.mapService.closeInfoWindow();
	}

	onMapIdle(): void {
    if (!this.localized) return;
    const position = this.mapService.mapCenter;
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
      .subscribe((address: string) => {

        const content = `<div padding><strong>${address}</strong></div>`;
        this.mapService.createInfoWindow(content, position);

      }, (error) => {
        console.error(error);
      });
  }

	/**
	 * Get the current position
	 */
	private locate(): Promise<any> {
	  const loader = this.loadingCtrl.create({
	    content: 'Please wait...',
	  });
	  loader.present();
	  return this.mapService.setPosition().then(() => {
	    this.localized = true;

	  }).catch(error => {

	    console.warn(error);
	  }).then(() => {
	    // TODO why dismiss not working without setTimeout ?
	    setTimeout(() => {
	      loader.dismiss();
	    }, 1000);
	  });
	}

}