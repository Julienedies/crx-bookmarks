crx-bookmarks
================================

一个关于书签管理的chrome扩展。

### 简介：

chrome自带的书签管理器过分简洁，应用商店里也没找到符合我需求的合适扩展。索性就自己实现了这么一个扩展。

为了避免在扩展和chrome自带书签管理器之间来回切换，扩展同时也实现了chrome自带书签管理器的功能，如导入导出；添加，删除，修改，移动等。

该扩展增添了一些新功能（主要是为我量身定制），例如多种方式排序； 查看最近访问书签，书签访问次数，为书签添加标签，分类，书签回收站等。

<a href="http://julienedies.github.io/demos/bookmarkManager/index.html"> 查看截图</a>

### 使用方法：
有兴趣的朋友可以下载源码后，通过chrome中的开发者模式，加载此扩展程序试用。

##技术选项：
使用<a href="http://yeoman.io/">yeoman</a>管理工作流(主要是配合<a href="https://angularjs.org/">angularJs</a>使用才引入)；  <br />
使用<a href="http://karma-runner.github.io/0.12/index.html">karma</a>和<a href="http://jasmine.github.io/">jsmaine</a>及<a href="https://github.com/angular/protractor">Protractor</a>进行单元测试和e2e测试；   <br />
使用<a href="http://gruntjs.com/">grunt</a>处理项目构建中的常见任务；（作为yeoman中的一个组件）    <br />
使用<a href="https://angularjs.org/">angularJs</a>对应用进行组织架构；  <br />
使用<a href="http://jquery.com/">jquery</a>处理dom操作；  <br />
使用<a href="http://d3js.org/">d3</a>处理数据可视化；  <br />
css部分引用了<a href="http://getbootstrap.com/">bootstrap.css</a> && <a href="http://daneden.github.io/animate.css/">Animate.css</a>；

### 其它：
其它就没有了.


