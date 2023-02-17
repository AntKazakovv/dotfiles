import {takeUntil} from 'rxjs/operators';
import {interval, Subscription, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {ChatListService} from './chat-list.service';
import {Direction, IMessage} from 'wlc-engine/modules/chat/system/interfaces';

const randomNicknames: [string, string][] = [
    ['Jenna Cox', 'ae8d953784b319e77c9bc1719242d1fd'], // md5 hash for gravatar, must be done by backend
    ['Molly Becker', '43c033f8a646ce5a5c20ed4c2a968b37'],
    ['BOOGIEMAN', 'be83b16854137a120537e7fabb542a11'],
    ['Yvonne Simpson', '2558d5c1226bba61c7b5c1cee44790aa'],
    ['Bob Bell', '7e49eee6cadf8564146ed7833d07174a'],
    ['Guillermo Wade', '555a0e1f2cf1d7b53291679e9d00fc6e'],
    ['Sammy Rowe', 'e50ddcde9e91ae257adeaaf576589893'],
    ['Daryl Poole', '8d7ec90a4b8012ffa39ec338cc076145'],
    ['Eric Phelps', '28934e8fc44ed7bdbbcca0a1f441ac58'],
    ['Jon Alexander', 'a350652f5082e58a4babdd5dd8af6ddc'],
];

const randomMessages: string[] = [
    'Good question - I am still trying to figure that out!',
    'I think dogs should be allowed to vote!',
    'I SEE YOU!',
    'Go to the bathroom and lock the door. If you hear anything, run!',
    '♥♥♥♥♥♥♥♥♥♥',
    'Fun fact: Australia\'s biggest export is boomerangs. It\'s also their biggest import.',
    'What do you call a man with a rubber toe? Roberto!',
    'What did the little mountain say to the bigger mountain? Hi Cliff!',
    'Why are there gates around cemeteries? Because people are dying to get in!',
    'What do bees do if they need a ride? Wait at the buzz stop!',
    'What did the finger say to the thumb? I\'m in glove with you.',
    'What do you call a magician dog? A labracadabrador.',
    'What concert costs only 45 cents? 50 Cent and Nickelback.',
    'Why do ghosts love elevators? Because it lifts their spirits.',
    'Did you hear the rumor about butter? Never mind, I shouldn\'t spread it.',
    'I\'m not a big fan of stairs. They\'re always up to something.',
    'How can you make seven an even number? Just take away the "s"!',
    'There are three types of people in the world. Those of us who '
        + 'are good at math and those of us who aren\'t.',
];

@Injectable({providedIn: 'root'})
export class FakeService {
    protected randomChat: Subscription;
    protected stopper$: Subject<void> = new Subject();

    constructor(
        protected chatListService: ChatListService,
    ){
        this.init();
    }

    public getFakeMessage(): string {
        return this.getRandomArrElem(randomMessages);
    }

    protected runTimeoutMessages(seconds: number): void {
        if (!this.randomChat) {
            this.randomChat = interval(seconds * 1000)
                .pipe(takeUntil(this.stopper$))
                .subscribe(() => {
                    const [name, hash] = this.fakeName;
                    this.chatListService.addMessage({
                        direction: Direction.in,
                        body: this.getFakeMessage(),
                        datetime: new Date(),
                        from: {
                            nickname: name,
                            affiliation: 'none',
                            role: 'fake',
                        },
                        hash: hash,
                    });
                });
        }
    };

    protected init(): void {
        this.chatListService.messages$.subscribe((message: IMessage) => {
            if (message.direction === Direction.out) {
                if (message.body.toLowerCase().includes('start')) {
                    const seconds = +(message.body.split(' ')[1] || 3);
                    this.runTimeoutMessages(seconds);
                } else if (message.body.toLowerCase().includes('stop')) {
                    this.stopper$.next();
                    this.randomChat = null;
                } else if (message.from.role === 'faker') {
                    const [name, hash] = this.fakeName;
                    setTimeout(() => {
                        this.chatListService.addMessage({
                            direction: Direction.in,
                            body: this.getFakeMessage(),
                            datetime: new Date(),
                            from: {
                                nickname: name,
                                affiliation: 'none',
                                role: 'fake',
                            },
                            hash: hash,
                        });
                    }, 500);
                }

            }
        });
    }

    protected revertMessage(msg: string): string {
        return msg.split('').reverse().join('');
    }

    protected get fakeName(): [string, string] {
        return this.getRandomArrElem<[string, string]>(randomNicknames);
    }

    protected getRandomArrElem<T = string>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
