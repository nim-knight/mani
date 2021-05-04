<template>
  <span class="TxtEditor">
    <span
      class="value"
      v-if="!inputShowed"
    >{{ value }}
    </span>

    <input
      v-show="inputShowed"
      ref="input"
      type="text"
      v-model="innerValue"
      @blur="inputValue"
      @keypress.enter="inputValue"
      @keydown.stop
    >
    <font-awesome-icon
      v-show="!inputShowed && !hiddenEditBtn"
      class="edit-icon"
      :title="editBtnTitle"
      :icon="['fas', 'pen']"
      @click="handleIconClick"
    />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class TxtEditor extends Vue {
  @Prop({ type: String, required: true })
  private value!: string;

  @Prop({ type: String, required: false, default: '' })
  private editBtnTitle!: string;

  @Prop({ type: String, required: false, default: '' })
  private defaultText!: string;

  @Prop({ type: Boolean, required: false, default: false })
  private hiddenEditBtn!: boolean;

  private innerValue = '';
  private inputShowed = false;

  public startInput () {
    this.inputShowed = true
    this.$nextTick(() => {
      this.innerValue = this.value;
      (this.$refs.input as HTMLElement).focus()
    })
  }

  private handleIconClick () {
    this.startInput()
  }

  private inputValue () {
    this.inputShowed = false
    this.$emit('input', this.innerValue || this.defaultText);
    (this.$el as HTMLElement).scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">
@import '~@/style/variables.scss';
.TxtEditor {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  padding-right: 20px;
  .edit-icon {
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 0px;
    margin-left: 5px;
    cursor: pointer;
    width: 10px;
    height: 10px;
  }

  .value {
    display: inline-block;
    width: 100%;
  }

  .input-div {
    display: inline-block;
  }

  input {
    border: none;
    width: 100%;
    background: transparent;
    outline: none;
    color: $text-color;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
  }
}
</style>
