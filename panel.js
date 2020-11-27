import { createElement, Text, Wrapper } from './createElement'
import {Timeline, Animation} from "./animation"
import {linear,ease} from "./cubicBezier";


export class TabPanel {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
        this.state = Object.create(null);
    }

    setAttribute(name, value) { //attribute
        this[name] = value;
    }
    getAttribute(name) { //attribute
      return  this[name];
    }

    appendChild(child) {
        this.children.push(child);
        console.log(this.children);
    }

    select(i) {
        for (let view of this.childViews) {
            view.style.display = 'none';
        }
        this.childViews[i].style.display = "";


        for (let view of this.titleViews) {
           view.classList.remove("selected");
        }
        this.titleViews[i].classList.add("selected");

        // this.titleView.innerText = this.children[i].title;
    }
    render() {
    this.childViews = this.children.map(child => <div style="width:300px;min-height:300px;">{child}</div>);
    this.titleViews = this.children.map((child, i) => <span onClick={() => this.select(i)}
    style="background-color:lightgreen;margin:0 1px;padding:5px;border-top-left-radius: 5px;border-top-right-radius: 5px;"
    >{child.getAttribute("title") || " "}</span>);
      
    setTimeout(() => this.select(0),16);
       return <div class="panel" style="width:300px;">
          <div style="width:300px;margin:0;">{this.titleViews}</div> 
            <div style="border:1px solid lightgreen;">
              {this.childViews}
            </div>
        </div>
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }

}