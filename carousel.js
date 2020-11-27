import { createElement, Text, Wrapper } from './createElement'
import {Timeline, Animation} from "./animation"
import {linear,ease} from "./cubicBezier";

import css from "./carousel.css";

console.log(css);
// let style = document.createElement("style");
// style.innerHTML = css[0][1];
// document.documentElement.appendChild(style);

export class Carousel {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) { //attribute
        this[name] = value;
    }

    appendChild(child) {
        this.children.push(child);
    }


    render() {
        let timeline = new Timeline;
        timeline.start();

        let position = 0;

        let nextPicStopHandler = null;


        let children = this.data.map((url, currentPosition) => {
            let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;

            let offset = 0;

            let onStart = () => {
                timeline.pause();
                clearTimeout(nextPicStopHandler);

                let currentElement = children[currentPosition];

                let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
                offset = currentTransformValue  + 500 * currentPosition;
               
            }
            let onPan = event => {
                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let dx = event.clientX - event.startX;

                let currentTransformValue = -500 * currentPosition + offset + dx;
                let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

               
                currentElement.style.transform = `translateX(${currentTransformValue}px)`;
                lastElement.style.transform = `translateX(${lastTransformValue}px)`;
                nextElement.style.transform = `translateX(${nextTransformValue}px)`;

            }

            let onPanend = event => {
                let direction = 0;
                let dx = event.clientX - event.startX;


                // 往右
                if (dx + offset > 250 || dx > 0 && event.isFlick) {
                    direction = 1;
                }
                // 往左
                else if (dx + offset < -250 || dx < 0 && event.isFlick) {
                    direction = -1;
                }

                timeline.reset();
                timeline.start();

                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];


                if (direction) {
                    let lastAnimation = new Animation(
                        lastElement.style, 
                        "transform", 
                        -500 - 500 * lastPosition + offset + dx,
                        -500 - 500 * lastPosition + direction * 500,
                       500,0,ease, v => `translateX(${v}px)`);

                    let currentAnimation = new Animation(
                        currentElement.style, 
                        "transform", 
                        -500 * currentPosition + offset + dx,
                        - 500 * currentPosition + direction * 500,
                       500,0,ease, v => `translateX(${v}px)`);
       
                    let nextAnimation = new Animation(
                        nextElement.style, 
                        "transform", 
                        500 - 500 * nextPosition + offset + dx,
                        500 - 500 * nextPosition + direction * 500,
                       500,0, ease, v => `translateX(${v}px)`);

                       timeline.add(lastAnimation);
                       timeline.add(currentAnimation);
                       timeline.add(nextAnimation);

                       position = (position - direction + this.data.length) % this.data.length;
                       nextPicStopHandler = setTimeout(nextPic, 3000);
                }
            }

            let element = <img src={url} onStart = {onStart}  onPan = {onPan} onPanend={onPanend} enableGesture={true} />
            element.style.transform = "translateX(0px)";
            element.addEventListener('dragstart', event => { event.preventDefault() })
            return element;
        })

        let root = (<div class='carousel'>{children}</div>);

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;
            // 获得当前元素
            let current = children[position];
            // 获得下一个元素
            let next = children[nextPosition];

            let currentAnimation = new Animation(
                 current.style, 
                 "transform", 
                -100 * position,
                -100 - 100 * position,
                500,0,ease, v => `translateX(${5 * v}px)`);

             let nextAnimation = new Animation(
                 next.style, 
                 "transform", 
                 100 - 100 * nextPosition,
                 -100 * nextPosition,
                500,0,ease, v => `translateX(${5 * v}px)`);

                timeline.add(currentAnimation);
                timeline.add(nextAnimation);
                
                position = nextPosition;
            /*
             设置当前元素开始移动，每次移动两张
                当前图片向左移动, 下一图片向左移动
                16毫秒大约为一帧 
             */

            // current.style.transition = 'ease 0s';
            // next.style.transition = 'ease 0s';
            // 起点
            // current.style.transform = `translateX(${-100 * position}%)`;
            // next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;


            // transition生效是需要时间的， 因此需要加 setTimeout
            // setTimeout(() => {
                // current.style.transition = '';
                // next.style.transition = '';

                // current.style.transform = `translateX(${-100 - 100 * position}%)`;
                // next.style.transform = `translateX(${-100 * nextPosition}%)`;

                // 获得一下一个元素下标, 当最后一张图片后，然后重新从0开始
                // position = nextPosition;
            // }, 16);

        //    window.xstopHandler = setTimeout(nextPic, 3000);
              nextPicStopHandler = setTimeout(nextPic, 3000);
        }
        nextPicStopHandler = setTimeout(nextPic, 3000);

        // root.addEventListener("mousedown", event => {
        //     let startX = event.clientX, startY = event.clientY;

        //     let lastPosition = (position - 1 + this.data.length) % this.data.length;
        //     let nextPosition = (position + 1) % this.data.length;

        //     let current = children[position];
        //     let last = children[lastPosition];
        //     let next = children[nextPosition];

        //     current.style.transition = 'ease 0s';
        //     last.style.transition = 'ease 0s';
        //     next.style.transition = 'ease 0s';


        //     current.style.transform = `translateX(${- 500 * position}px)`;
        //     last.style.transform = `translateX(${-500 - 500 * nextPosition}px)`;
        //     next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;


        //     let move = event => {
        //         current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
        //         last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * nextPosition}px)`;
        //         next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`;

        //     };
        //     /*
        //     判断，拖动时，
        //     1.不动， 
        //     2.往左，
        //     3.往右
        //     */
        //     let up = event => {
        //         let offset = 0;
        //         // 往右
        //         if (event.clientX - startX > 250) {
        //             offset = 1;
        //         }
        //         // 往左
        //         else if (event.clientX - startX < -250) {
        //             offset = -1;
        //         }

        //         // 把 transition 打开
        //         current.style.transition = '';
        //         last.style.transition = '';
        //         next.style.transition = '';

        //         current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
        //         last.style.transform = `translateX(${offset * 500 - 500 - 500 * nextPosition}px)`;
        //         next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;

        //         position = (position - offset + this.data.length) % this.data.length;;

        //         document.removeEventListener("mousemove", move);
        //         document.removeEventListener("mouseup", up);
        //     };
        //     document.addEventListener("mousemove", move);
        //     document.addEventListener("mouseup", up);
        // })
        return root
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }

}