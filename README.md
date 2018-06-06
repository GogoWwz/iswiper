# iswiper

## 项目介绍

* 移动端横向标签滑动效果
    
* 依赖zepto
   
* 解决了不需要动态加载时，模块高度不同导致页面高度变化的问题
	
## 项目使用

## 效果预览
![image](https://github.com/GogoWwz/iswiper/blob/master/static/preview.gif)

### 引入说明

- dist/js/中的iswiper.js
- dist/css/中的css

### 调用

- 页面相关
```
<ul class="myswipper-box">
    <li class="myswipper-item style1">1</li>
    <li class="myswipper-item style2">2</li>
    <li class="myswipper-item style3">3</li>
    <li class="myswipper-item style4">4</li>
    <li class="myswipper-item style5">5</li>
</ul>
```

- js相关
```
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
```


## 回调函数

* touchStart: 触摸时回调   
* touchMove: 滑动时回调    
* touchEnd: 滑动结束时回调
* tagClick: 标签点击时回调

## TODO

- 除去zepto依赖
- 提供api接口