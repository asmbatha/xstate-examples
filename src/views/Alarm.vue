<template>
    <div id="clock" :class="{
        timer: state.matches('timer'),
        ringing: state.matches('ringing'),
    }">
        <div class="time">{{ time }}</div>
        <div class="date">{{ date }}</div>
        <div class="actions">
            <div class="state">
                {{ state.value }}
            </div>
            <button @click="send('SET', { timer: 5000 })">SET ALARM</button>
            <button @click="send('STOP')">STOP</button>
            <button @click="send('SNOOZE')">SNOOZE</button>
        </div>
    </div>
</template>
<script>
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'

const timeMachine = createMachine({
    id: 'time-machine',
    initial: 'idle',
    states: {
        idle: {
            on: {
                SET: 'timer'
            }
        },
        timer: {
            invoke: {
                src: (context, event) => (callback) => {
                    const id = setTimeout(() => callback('DONE'), event.timer || 1000)
                    return () => clearTimeout(id)
                }
            },
            on: {
                DONE: 'ringing'
            }
        },
        ringing: {
            on: {
                STOP: 'idle',
                SNOOZE: 'timer'
            }
        }
    }
})

export default {
    data () {
        const { state, send } = useMachine(timeMachine)
        return {
            state, send,
            date: '',
            time: 'Starting'
        }
    },
    mounted () {
        setInterval(this.updateTime, 1000)
    },
    methods: {
        updateTime () {
            const cd = new Date()
            this.time = `${format(cd.getHours(), 2)}:${format(cd.getMinutes(), 2)}:${format(cd.getSeconds(), 2)}`
            this.date = `${format(cd.getFullYear(), 4)}-${format(cd.getMonth()+1, 2)}-${format(cd.getDate(), 2)} ${week[cd.getDay()]}`
        }
    }
}
const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
function format (num, digit) {
    return num.toLocaleString('en-US', { minimumIntegerDigits: digit, useGrouping:false })
}
</script>

<style lang="scss" scoped>
#clock {
    background: #0f3854;
    background: radial-gradient(ellipse at center,  #0a2e38  0%, #000000 70%);
    background-size: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: 'Share Tech Mono', monospace;
    text-align: center;
    color: #daf6ff;
    text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
    font-size: 15vw;
    .time {
        padding-right: 3vw;
    }
    .date {
        font-size: 25%;
    }

    &.timer {
        color: #0ae64f;
    }
    
    &.ringing {
        animation: blinking 1s infinite;
    }

}
.actions {
    width: 100%;
    position: absolute;
    top: 0;
    padding: 16px;
    font-size: 16px;
    button {
        padding: 8px 16px;
        margin: 0 4px;
    }

    .state {
        color: white;
        text-align: center;
    }
}
@keyframes blinking {
    0%, 49% {
        color: #e50000;
    }
    50%, 100% {
        color: #ffffff;
    }
}
</style>
