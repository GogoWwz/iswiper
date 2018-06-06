import './index.scss'
import $ from 'zepto'

class Swipper {
    constructor(option) {
        // 回调函数
        this.touchStart = option.touchStart ? option.touchStart : null
        this.touchMove = option.touchMove ? option.touchMove : null
        this.touchEnd = option.touchEnd ? option.touchEnd : null
        this.tagClick = option.tagClick ? option.tagClick : null

        // 起始点
        this.x1 = 0
        this.y1 = 0
        // 终点
        this.x2 = 0
        this.y2 = 0

        // 位移
        this.moveX = 0
        this.moveY = 0

        // 方向
        this.dire = 0

        // 所在模块位置
        this.idx = 0

        // 是否已经进行手势判断
        this.flag = false
        
    }
    // 构建插件
    init() {
        this.initElement()
        this.initPos()
        this.initBoxHeight()
        this.tagTap()
        this.initPlugin()
    }
    // 获取元素相关
    initElement() {
        // 元素
        this.$box = $(".myswipper-box")
        this.$items = $(".myswipper-item")
        this.$tags = $(".myswipper-tags")
        // 容器宽度
        this.w = this.$box.width()
        // 模块数量
        this.sum = this.$items.length
    }
    // 初始化状态
    initPos() {
        this.$items.eq(0).addClass("myswipper-item-show")
        this.$tags.children().eq(0).addClass("myswipper-tag-active")
    }
    // 绝对定位消除高度影响,获取显示模块高度
    initBoxHeight() {
        this.$box.css("height", $(".myswipper-item-show").height())
    }
    // 标签
    tagTap() {
        let _this = this
        this.$tags.on("click", ".myswipper-tag", function(e) {
            let $this = $(this)
            _this.idx = $this.index()
            _this.setActiveTag()
            $(".myswipper-item-show").removeClass("myswipper-item-show")
            _this.$items.eq(_this.idx).addClass("myswipper-item-show").css("transform","translate(0,0)") 
            _this.$items.each(function(i) {
                if(i < _this.idx) {
                    $(this).css("transform", "translate(-100%, 0)")
                }else if(i > _this.idx) {
                    $(this).css("transform", "translate(100%, 0)")
                }
            })
            if(_this.tagClick) _this.tagClick(e)
            _this.initBoxHeight()
        })
    }
    // 绑定事件
    initPlugin() {
        let _this = this   
        // 滑动开始
        _this.$box.on("touchstart", function(e) {
            _this.x1 = e.touches[0].pageX
            _this.y1 = e.touches[0].pageY
            _this.$items.removeClass("myswipper-animate")
            if(_this.touchStart) {
                _this.touchStart(e)
            }         
        })
        // 滑动过程
        _this.$box.on("touchmove", function(e) {
            _this.x2 = e.touches[0].pageX
            _this.y2 = e.touches[0].pageY
            _this.moveX = _this.x2 - _this.x1
            _this.moveY = _this.y2 - _this.y1
            // 判断初始手势滑动方向
            if(!_this.flag) {
                if(_this.moveX *_this.moveX + _this.moveY * _this.moveY >= 64){
                    _this.judgeTouch(_this.moveX, _this.moveY)
                    _this.flag = true
                }
            }
            if( _this.dire == 1 || _this.dire == -1) {
                e.preventDefault() 
                _this.swipeMove()
                if(_this.touchMove) {
                    _this.touchMove()
                }
                
            }
        })
        // 滑动结束
        _this.$box.on("touchend", function(e) {
            _this.flag = false
            if(_this.dire == 1 || _this.dire == -1) {
                let msg = _this.isBorder()
                _this.$items.addClass("myswipper-animate")
                if(!msg) {
                    _this.swipeGo()
                    if(_this.touchEnd) {
                        _this.touchEnd()
                    }
                    
                } else {
                    _this.swipeBack()
                }            
            }  
            _this.clearMove()
        })
    }

    // 滑动过程
    swipeMove() {
        let $show = $(".myswipper-item-show")
        let $readyShow = $show.next()
        let readyMove = this.moveX + this.w
        if(this.dire == 1) {
            $readyShow = $show.prev()
            readyMove = this.moveX - this.w
        }
        $readyShow.css("transform", `translate(${readyMove}px,0)`)
        $show.css("transform", `translate(${this.moveX}px,0)`)
    }
    // 滑动结束
    swipeGo() {
        let $show = $(".myswipper-item-show")
        let showMove = "-100%"
        let $readyShow = $show.next()
        if(this.dire == 1) {
            showMove = "100%"
            $readyShow = $show.prev()
            this.idx -= 1
        } else {
            this.idx += 1
        }
        $show.removeClass("myswipper-item-show")
        $readyShow.addClass("myswipper-item-show") 
        $show.css("transform", `translate(${showMove}, 0)`)
        $readyShow.css("transform", `translate(0, 0)`)
        this.setActiveTag()
        this.initBoxHeight()
    }
    // 边界阻凝
    swipeBack() {
        let $show = $(".myswipper-item-show")
        let msg = this.isBorder()
        $show.css("transform", `translate(0, 0)`)
        if(msg == "lb" || msg == "leftless") {
            $show.next().css("transform", `translate(100%, 0)`)
        } else if(msg == "rb" || msg == "rightless") {
            $show.prev().css("transform", `translate(-100%, 0)`)
        }
    }
    // 需要回弹判断
    isBorder() {
        if(this.dire == 1 && this.idx == 0) return 'lb'
        if(this.dire == -1 && this.idx == this.sum -1) return 'rb' 
        if(this.moveX * this.moveX + this.moveY * this.moveY <= 2500) {
            if(this.dire == 1) return 'rightless' 
            if(this.dire == -1) return 'leftless'
        }
        return false
    }
    // 判断手势
    judgeTouch(x, y) {
        let nx = Math.abs(x)
        let ny = Math.abs(y)
        let dire = this.dire
        if ( nx > ny && x > 0 ) {
            // 右
            dire = 1
        }else if ( nx > ny && x < 0 ) {
            // 左
            dire = -1
        }else if ( ny > nx && y > 0) {
            // 下
            dire = -2
        }else if ( ny > nx && y < 0 ) {
            // 上
            dire = 2
        }else {
            // 没动
            dire = 0
        }
        this.dire = dire
    }
    // 清除位移
    clearMove() {
        this.moveX = 0
        this.moveY = 0
    }
    // 设置选中标签
    setActiveTag() {
        this.$tags.children().eq(this.idx).addClass("myswipper-tag-active").siblings().removeClass("myswipper-tag-active")
    }

}
const sw = new Swipper({
    touchStart: function(e) {
        // console.log("start") 
    },
    touchMove: function() {
        // console.log("move")
    },
    touchEnd:function() {
        // console.log("end")
    },
    tagClick: function(e) {
        // console.log(e)
    }
})

sw.init()


