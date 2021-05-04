<template>
<div
  v-show="contextmenu.opened"
  class="ApplicationEditorMenu"
  @click="closeContextmenu"
  @contextmenu="closeContextmenu"
>
  <div class="contextmenu"
    :style="{
      top: contextmenu.y + 'px',
      left: contextmenu.x + 'px'
    }"
    @click.stop
  >
    <template v-for="(item, i) in contextmenu.meunItems">
      <div
        v-if="item.name === 'split-line'"
        class="meun-split-line"
        :key="i"
      ></div>
      <div
        v-else-if="item.disable"
        class="meun-item-disable"
        :key="i"
      >{{item.name}}</div>
      <div
        v-else
        class="meun-item"
        :class="{ 'split-line': item.name === 'split-line' }"
        :key="i"
        @click="() => {
          item.handler && item.handler();
          closeContextmenu();
        }"
      >{{item.name}}</div>
    </template>
  </div>
</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

export interface MeunItem {
  name: string;
  disable?: boolean;
  handler?: () => unknown;
}

@Component
export default class ApplicationEditorMenu extends Vue {
  private contextmenu: {
    opened: boolean;
    x: number;
    y: number;
    meunItems: MeunItem[];
  } = {
    opened: false,
    x: 0,
    y: 0,
    meunItems: []
  }

  public openContextmenu (x: number, y: number, meunItems: MeunItem[]) {
    const contextmenu = this.contextmenu
    const clientHeight = document.body.clientHeight
    const clientWidth = document.body.clientWidth
    const maxX = clientWidth - 350
    const maxY = clientHeight - meunItems.length * 32
    contextmenu.opened = true
    contextmenu.x = Math.min(x, maxX)
    contextmenu.y = Math.min(y, maxY)
    contextmenu.meunItems = meunItems
  }

  public closeContextmenu () {
    const contextmenu = this.contextmenu
    contextmenu.opened = false
    contextmenu.x = 0
    contextmenu.y = 0
    contextmenu.meunItems = []
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.ApplicationEditorMenu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;

  .contextmenu{
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 0;
    background: $panel-background-color;
    box-shadow: 0px 0px 5px 1px #000000;
    width: 350px;
    z-index: 100;
  }

  .meun-item {
    height: 32px;
    line-height: 32px;
    padding: 0 15px 0 15px;
    cursor: pointer;
    border-left: solid 1px transparent;
  }

  .meun-item-disable {
    height: 32px;
    line-height: 32px;
    padding: 0 15px 0 15px;
    color: fadeout($text-color, 50%);
    cursor: not-allowed;
  }

  .meun-split-line {
    margin: 2px 15px 2px 15px;
    height: 1px;
    width: calc(100% - 30px);
    background: $text-color-gray;
    color: transparent;
    opacity: 0.35;
  }

  .meun-item:hover {
    background: rgba(0,0,0,0.25);
    // color: $primary-color-lighten;
    border-left: solid 1px $primary-color;
  }
}
</style>
