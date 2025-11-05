import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles:`

    .swiper {
      width: 100%;
      height: 500px;
    }

  `
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    if (changes['images'].firstChange) return;
    if(!this.swiper) return;
    this.swiper.destroy(true, true);// TODO Limpia toda la instancia y estilos
    this.swiperInit();

  }

  ngAfterViewInit(): void {
     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.swiperInit();
  }


  swiperInit(){
    const element = this.swiperDiv().nativeElement;
    if(!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
