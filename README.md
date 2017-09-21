###设置nodejs的镜像为淘宝镜像
设置淘宝镜像，否则``node-saas``会因为网络问题而下载失败

- `npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/`


- `npm config set phantomjs_cdnurl=http://cnpmjs.org/downloads`


- `npm config set electron_mirror=https://npm.taobao.org/mirrors/electron/`
- npm config set registry=https://registry.npm.taobao.org
 
###构建      
		 
- 从仓库拉取前端代码： ` git clone/pull`

- 在src添加meta空文件夹: `touch meta` (以后如果有meta文件就不用加了)


- 代码的目录下运行命令` npm i` 安装依赖包
	

- 修改后端的接口：src/app/core/constants/global-setting.ts: `export const baseUrl = 'http://192.168.3.86:8030';`
									

- 修改前端端口： config/webpack.dev.js: `const PORT = process.env.PORT || 3000;`

###启动
`npm start`启动内置http server

###访问
`localhost:3000`