const timeMachine = {
    id: 'time-machine',
    initial: 'Idle',
    states: {
        Idle: {
            on: {
                SET: 'Timer'
            }
        },
        Timer: {
            invoke: {
                src: (context, event) => (callback) => {
                    const id = setTimeout(() => callback('DONE'), event.timer || 1000)
                    return () => clearTimeout(id)
                }
            },
            on: {
                DONE: 'Ringing'
            }
        },
        Ringing: {
            on: {
                STOP: 'Idle',
                SNOOZE: 'Timer'
            }
        }
    }
}