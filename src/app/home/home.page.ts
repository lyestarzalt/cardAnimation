import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import {
  AnimationBuilder,
  AnimationPlayer,
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { IonCard } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('detailEnterLeave', [
      state(
        'void',
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        })
      ),
      state(
        '*',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition(':enter', [animate('0.5s ease-out')]),
      transition(':leave', [animate('0.5s ease-out')]),
    ]),
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChildren(IonCard, { read: ElementRef })
  cardElements!: QueryList<ElementRef>;
  selectedCardIndex: number | null = null;
  isFlipped: boolean = false;
  detailPlayer?: AnimationPlayer;
  initialOffset: number = 40;
  cards = [
    {
      title: 'ID',
      color: 'blue',
      frontDetail: {
        name: 'Lyes Tarzalt',
        issuer: 'Algeria Gov',
        documentID: '532593759',
        issueDate: '12-Jan-2023',
        expiryDate: '12-Jan-2033',
        nationality: 'Algeria',
        passportNo: 'D35709212',
        dob: '04 Jan 2003',
      },
      backDetail: 'Back: More on Lyes Tarzalt...',
      isFlipped: false,
    },
    {
      title: 'Insurance',
      color: 'red',
      frontDetail: {
        name: 'Lyes Tarzalt',
        issuer: 'Great Eastern',
        documentID: '532593759',
        issueDate: '12-Jan-2023',
        expiryDate: '12-Jan-2024',
        nationality: 'Algeria',
        passportNo: 'D35709212',
        dob: '04 Jan 2003',
      },
      backDetail: 'Back: More on Lyes Tarzalt...',
      isFlipped: false,
    },
    {
      title: 'Visa',
      color: 'green',
      frontDetail: {
        name: 'Lyes Tarzalt',
        issuer: 'MayBank',
        documentID: '532593759',
        issueDate: '12-Jan-2023',
        expiryDate: '12-Jan-2024',
        nationality: 'Algeria',
        passportNo: 'D35709212',
        dob: '04 Jan 2003',
      },
      backDetail: 'Back: More on Lyes Tarzalt...',
      isFlipped: false,
    },
  ];

  players: AnimationPlayer[] = [];
  showDetail: boolean = false;

  constructor(private builder: AnimationBuilder) {}

  ngAfterViewInit() {
    this.setInitialCardPosition();
  }

  setInitialCardPosition() {
    this.cardElements.forEach((card, index) => {
      const player = this.builder
        .build([
          style({
            transform: `translateY(${index * this.initialOffset}px)`,
            opacity: 1,
          }),
        ])
        .create(card.nativeElement);
      player.play();
    });
  }

  onCardClick(index: number) {
    if (this.selectedCardIndex === index && this.showDetail) {
      // Hide the detail card
      this.showDetail = false;
      this.selectedCardIndex = null;
      this.resetCards();
    } else {
      // Show the detail card
      this.selectedCardIndex = index;
      this.showDetail = true;
      this.animateCards();
    }
  }

  animateCards() {
    const offscreenY = 200 + 150 * this.cardElements.length;
    this.cardElements.forEach((card, i) => {
      const y = i === this.selectedCardIndex ? 0 : offscreenY;
      const opacity = i === this.selectedCardIndex ? 1 : 0;
      const player = this.builder
        .build([
          animate(
            '1s ease-out',
            style({
              transform: `translateY(${y}px)`,
              opacity: opacity,
            })
          ),
        ])
        .create(card.nativeElement);
      player.play();
    });
  }

  resetCards() {

    this.cardElements.forEach((card, index) => {
      const player = this.builder
        .build([
          animate(
            '1s ease-out',
            style({
              transform: `translateY(${index * this.initialOffset}px)`,
              opacity: 1,
            })
          ),
        ])
        .create(card.nativeElement);
      player.play();
    });
    if (this.showDetail) {
      this.animateDetailCard(false);
    }
  }
  toggleCard(index: number) {
    this.cards[index].isFlipped = !this.cards[index].isFlipped;
  }

  toggleDetail() {
    console.log('detaiiled clicked');
    this.isFlipped = !this.isFlipped;
  }
  animateDetailCard(show: boolean) {
    const detailElement = document.querySelector('.card-detail');

    if (this.detailPlayer) {
      this.detailPlayer.destroy();
    }

    const initialStyle = {
      transform: show ? 'translateY(100%)' : 'translateY(0)',
      opacity: show ? 0 : 1,
    };

    const targetStyle = {
      transform: show ? 'translateY(0)' : 'translateY(100%)',
      opacity: show ? 1 : 0,
    };

    const animation = this.builder.build([
      style(initialStyle),
      animate('0.5s ease-out', style(targetStyle)),
    ]);

    this.detailPlayer = animation.create(detailElement as any);
    this.detailPlayer.onDone(() => {
      if (!show) {
        this.showDetail = false;
      }
    });
    this.detailPlayer.play();
  }
}
