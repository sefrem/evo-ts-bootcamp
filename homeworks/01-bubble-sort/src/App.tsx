import React from 'react';

import Element from "./components/Element/Element";
import Interval from "./components/Interval/Interval";
import Controls from "./components/Controls/Controls";

import {generateRandomArray, checkIfSorted, interval} from "./helpers";
import {DEFAULT_ARRAY_SIZE, DEFAULT_INTERVAL} from "./constants";
import './App.css';

enum Status {
    Idle = 'idle',
    Pause = 'pause',
    Sort = 'sort',
    Solved = 'solved'
}

type State = {
    data: number[],
    status: Status,
    startIndex: number,
    sortInterval: number,
    intervalInput: number,
    sortByStep: boolean,
}

class App extends React.Component<any, State> {

    state: State = {
        data: generateRandomArray(DEFAULT_ARRAY_SIZE),
        status: Status.Idle,
        startIndex: 0,
        sortInterval: DEFAULT_INTERVAL,
        intervalInput: DEFAULT_INTERVAL,
        sortByStep: false,
    }

    sort = async (): Promise<void> => {
        const array = [...this.state.data]
        let swapped: boolean;
        let offset = 0;

        await this.setState({status: Status.Sort})

        outer: do {
            swapped = false

            for (let i = this.state.startIndex; i < array.length - offset; i++) {

                if (this.checkIfPaused()) {
                    this.setState({startIndex: i})
                    break outer
                }

                if (this.checkIfIdle()) {
                    this.setState({startIndex: 0})
                    break
                }

                if (this.state.startIndex > 0) {
                    this.setState({startIndex: 0})
                }

                if (array[i] > array[i + 1]) {
                    let temp = array[i];
                    array[i] = array[i + 1]
                    array[i + 1] = temp
                    this.setState({data: array})
                    swapped = true
                    await interval(this.state.sortInterval)

                    if (this.state.sortByStep) {
                        this.setState({status: Status.Pause})
                    }
                }
            }
            offset++;
        } while (swapped)

        if (!swapped && checkIfSorted(this.state.data)) {
            this.setState({status: Status.Solved})
        }

    }

    pause = (): void => this.setState({status: Status.Pause})

    reset = (): void => this.setState({
        data: generateRandomArray(DEFAULT_ARRAY_SIZE),
        startIndex: 0,
        status: Status.Idle
    })

    checkIfIdle = (): boolean => this.state.status === Status.Idle

    checkIfSolved = (): boolean => this.state.status === Status.Solved

    checkIfPaused = (): boolean => this.state.status === Status.Pause

    checkIfSort = (): boolean => this.state.status === Status.Sort

    onClickStart = (): void => {
        if (this.state.sortByStep) {
            this.setState({sortByStep: false})
        }
        if (this.checkIfIdle() || this.checkIfPaused()) {
            this.sort()
            return
        }
        this.pause()
    }

    onChangeInterval = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (+e.target.value < 0) return

        this.setState({intervalInput: +e.target.value})
    }

    setSortInterval = (): void => {
        this.setState({sortInterval: this.state.intervalInput})
    }

    stepSort = (): void => {
        this.setState({status: Status.Pause, sortByStep: true})
        setTimeout(() => this.sort(), 50)
    }

    render() {
        return (
            <main className="app">
                <h1>Bubble sort 🛁</h1>

                <div className='elements'>
                    {this.state.data.map((item, index) => <Element key={index} item={item}/>)}
                </div>

                <Controls checkIfSolved={this.checkIfSolved}
                          checkIfSort={this.checkIfSort}
                          reset={this.reset}
                          onClickStart={this.onClickStart}
                          sortByStep={this.state.sortByStep}
                          stepSort={this.stepSort}
                />

                <div className='status'>{this.checkIfSolved() ? 'Solved' : 'Not solved'}</div>

                <Interval intervalInput={this.state.intervalInput}
                          onChangeInterval={this.onChangeInterval}
                          setSortInterval={this.setSortInterval}
                />

            </main>
        );
    }

}

export default App;
