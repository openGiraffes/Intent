<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
#app {
    //   font-family: Avenir, Helvetica, Arial, sans-serif;
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale;
    //   text-align: center;
    //   color: #2c3e50;
    width: 100vw;
    height: 100vh;
    position: relative;
}

body {
    padding: 0px;
    margin: 0px;
    background: rgba($color: rgb(255, 255, 255), $alpha: 1.0);
    // background: rgba($color: rgb(0, 162, 255), $alpha: 1.0);
}
</style>
