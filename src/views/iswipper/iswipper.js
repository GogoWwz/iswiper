import './index.scss'
import $ from 'zepto'

class Swipper {
    constructor() {
        // 起始点
        this.X = 0
        this.Y = 0

        // 位移
        this.moveX = 0
        this.moveY = 0

        // 方向
        this.dire = 0

        // 所在模块位置
        this.idx = 0
    }
    // 构建插件
    init() {
        this.initElement()
        this.initPos()
        this.initW()
        this.tagTap()
        this.touchStart()
        this.touchMove()
        this.touchEnd()
    }
    // 获取元素相关
    initElement() {
        // 元素
        this.$box = $(".myswipper-box")
        this.$items = $(".myswipper-item")
        this.$tags = $(".myswipper-tag")
        // 容器宽度
        this.w = this.$box.width()
        // 模块数量
        this.sum = this.$items.length
    }
    // 各种长度初始化
    initW() {
        this.initBoxHeight()
        this.$items.width(this.w)
    }
    // 初始化状态
    initPos() {
        this.$items.eq(0).addClass("myswipper-item-show")
        this.$tags.eq(0).addClass("myswipper-tag-active")
    }
    // 标签点击
    tagTap() {
        let _this = this 
        $(".myswipper-tags").on("tap", ".myswipper-tag", function() {
            let $tag = $(this)
            _this.idx = $tag.index()
            _this.setActiveTag()
            $(".myswipper-item-show").removeClass("myswipper-item-show")
            _this.$items.eq(_this.idx).addClass("myswipper-item-show").css("transform","translate(0,0)") 
            _this.initBoxHeight()
            _this.$items.each(function(i) {
                if(i < _this.idx) {
                    $(this).css("transform", "translate(-100%, 0)")
                }else if(i > _this.idx) {
                    $(this).css("transform", "translate(100%, 0)")
                }
            })
        })
    }
    // 开始触屏
    touchStart() {
        let _this = this    
        this.$box.on("touchstart", function(e) {
            _this.X = e.touches[0].pageX
            _this.Y = e.touches[0].pageY
        })
    }
    // 滑动过程
    touchMove() {
        let _this = this
        this.$box.on("touchmove", function(e) {
            _this.moveX = e.touches[0].pageX - _this.X
            _this.moveY = e.touches[0].pageY - _this.Y
            _this.judgeTouch(_this.moveX,_this.moveY)
            if( _this.dire ==2 || _this.dire == 0) {
                // ....
            } else {
                let $show = $(".myswipper-item-show")
                _this.swiperMove($show)
            }
        })
    }
    // 滑动结束
    touchEnd() {
        let _this = this
        this.$box.on("touchend", function(e) {
            let $show = $(".myswipper-item-show")
            if(_this.dire != 2 && _this.dire !=0) {
                _this.swipper($show)
            }
        })
    }
    // 绝对定位消除高度影响,获取显示模块高度
    initBoxHeight() {
        this.$box.animate({
            "height": $(".myswipper-item-show").height()
        }, "300", "ease")
    }
    // 判断手势
    judgeTouch(x,y) {
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
            dire = 2
        }else if ( ny > nx && y < 0 ) {
            // 上
            dire = 2
        }else{
            // 没动
            dire = 0
        }
        this.dire = dire
    }
    swipper($showEl) {
        if(Math.abs(this.moveX) >= 50 && !this.isBorder()) {
            this.swipperJump($showEl)
        }else {
            this.backSwipe($showEl)
        }
    }
    // 滑动切换过程
    swipperJump($showEl) {
        let $readyShow = $showEl.prev()                   
        let showMove = "100%"     
        $showEl.removeClass("myswipper-item-show")                      
        if(this.dire == -1) {
            $readyShow = $showEl.next()
            showMove = "-100%"  
        }
        $readyShow.addClass("myswipper-item-show")
        $showEl.animate({
            "transform": `translate(${showMove},0)`
        }, 400, "ease")
        $readyShow.animate({
            "transform": `translate(0,0)`
        }, 400, "ease" )
        if(this.dire == 1) {
            this.idx -= 1
        } else if(this.dire == -1) {
            this.idx += 1
        }
        this.initBoxHeight()
        this.setActiveTag()
    }
    // 滑动移动过程
    swiperMove($showEl) {
        let $readyShow = $showEl.prev()                         //默认值为右滑
        let followD = this.moveX - this.w                       //默认值为右滑
        if(this.dire == -1) {
            followD = this.moveX + this.w
            $readyShow = $showEl.next()
        }
        $readyShow.css("transform", `translate(${followD}px,0)`)
        $showEl.css("transform", `translate(${this.moveX}px,0)`)
    }
    // 设置回弹 
    backSwipe($showEl) {
        let flag = this.isBorder()
        if(!flag) {        
            let $readyShow = $showEl.prev()                         //默认值为右滑
            let readyMove = "-100%"
            if(this.dire == -1) {
                $readyShow = $showEl.next()
                readyMove = "100%"
            }
            $readyShow.animate({
                "transform": `translate(${readyMove},0)`
            }, 400, "ease")
        }
        $showEl.animate({
            "transform": "translate(0,0)"
        }, 400, "ease")
    }
    // 边界判断
    isBorder() {
        if(this.dire == 1 && this.idx == 0) return "lb"
        if(this.dire == -1 && this.idx == this.sum - 1) return "rb"
        return false
    }
    // 设置选中标签
    setActiveTag() {
        this.$tags.eq(this.idx).addClass("myswipper-tag-active").siblings().removeClass("myswipper-tag-active")
    }
}

let swipper = new Swipper()
swipper.init()