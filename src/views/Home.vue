<template>
    <div class="home">
        <h1>Xstate examples</h1>
        <ul>
            <li><router-link to="/alarm">Alarm</router-link></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Home'
}
</script>

<style lang="scss" scoped>
.home {
    padding: 36px;
    > * + * {
        margin-top: 36px;
    }
}
</style>
