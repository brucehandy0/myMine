Ext.define('workList.view.Viewport',{
	extend:'Ext.container.Viewport',
	border:true,
	style:'background:rgba(28,193,251,.2)',
	cls:'li-viewport',
	layout:{
		type:'auto',
		//align:'center',

	},
	walkNum:0,//步数
	initComponent:function(){
		var self = this;
		
		this.callParent(arguments);			
		this.isMineArray=[];
		this.btnArray = [];
		this.idArray =[];
		this.xArray = [];
		this.yArray = [];
		
		var theID,isMine;
		
		//实现10*10的循环
		for(var i=1;i<11;i++){
			for(var j=1;j<11;j++){
				this.xArray.push(j);
				this.yArray.push(i);
				theID = j+""+i;
				this.idArray.push(theID);
				//雷的概率在20%
				isMine=Math.random()<0.15?true:false;
				this.isMineArray.push(isMine);
			}
		}
		
		//myLib.con(this.isMineArray);
		
		for(var k = 0;k<this.idArray.length;k++){
			this.btnArray.push(this.createButton(this.idArray[k],this.xArray[k]*30,this.yArray[k]*30,this.isMineArray[k],self));
		}

		var panel2 = Ext.create('Ext.panel.Panel',{
			style:'background:red',
			id:'panel2',
			width:300,
			height:300,
			x:500,
			y:31,
			html:'<h4>地雷的概率：15%，数量：'+this.checkIsWin(this.isMineArray,this.btnArray)[0].toString() 
			+'</br></br>暂不支持改变概 <br/><br/>可改善，生成x*x格子大小，地雷概率，暴露更多白地的算法，背景音乐和音效，分数，时间等等，做完后才发现扫雷的需求不是这样的。。</h4>',
			items:[
			{

			},
			],
			
		});
		var panel = Ext.create('Ext.panel.Panel',{
			layout:'absolute',
			width:'80%',
			cls:'panelC',
			//height:'80%',//如果父容器没有指定高度，子高度的百分比不会生效（width不会这样）
			height:800,
			items:this.btnArray,
				
		});
		panel.add(panel2);
		this.add(panel);

	},
	/**
	param id,left，top，isMine，width，height
	self是父容器的self
	*/
	createButton:function(id,left,top,isMine,self,width,height){
	//宽高不输入值，默认30px；
		var width = width||30;
		var height = width||30;
		
		var btn = Ext.create('Ext.Button',{
			id:id,
			cls:'btnC',
			x:left,
			y:top,
			width:width,
			height:height,
			text:'',//炸弹数量通过计算得出
			isMine:isMine,
			isClicked:false,
			// isIterate:false,
			//mineNum:0,//自己周围的雷的数量
			listeners:{
				click:function(){
					if(this.isMine){
						this.btnEl.addCls('btnR');
						Ext.Msg.confirm('踩到炸弹，你走了'+(self.walkNum+1)+'步'+'</br>game over','重新开始游戏吗',function(isContinue){
							if(isContinue==="yes"){
								window.history.go(0);
							}else{
								
							}
						});
					}else{
					//踩到白块
						this.btnEl.addCls('btnW');
					//计算周围的炸弹数量
					//xx 1-10
                        var xx = (this.x)/width; 
                        var yy = (this.y)/height;
                        var posArray=this.stupidLogic(xx,yy);
						this.isClicked=true;

                        var chooseBtn = [];
                        for(var i=0;i<posArray.length;i++){
                            chooseBtn[i] = Ext.getCmp(posArray[i][0]+""+posArray[i][1]);
                            this.getOwnMineNum(posArray[i][0],posArray[i][1]);

                            if(chooseBtn[i].isClicked){
                            //chooseBtn[i].setText('');
                            }else{
                                chooseBtn[i].setText(this.getOwnMineNum(posArray[i][0],posArray[i][1])+'');
                            }
                        //arr，8个位置中存储上下左右四个位置
                        //var arr = [1,3,4,6];
                            if(this.getOwnMineNum(posArray[i][0],posArray[i][1])==0&&(i==1||i==3||i==4||i==6)){
                                var AnotherId = posArray[i][0]+""+posArray[i][1];
                                var anotherBtn = Ext.getCmp(posArray[i][0]+""+posArray[i][1]);
                                if(!anotherBtn.isMine&&!anotherBtn.isClicked){
                                    anotherBtn.fireEvent('click');
                                }
                            }
                        }

						//被点击后数字消除
						this.setText('');
					}
					//检测是否游戏通关,触发连锁点击事件时，不必检查通关 
                    //没有迭代，才++,未解决
                    
                    self.walkNum++;
                    self.checkIsWin(self.isMineArray,self.btnArray);
                    
                          
				},
			},
			//通过给一个位置x，y，给出自己的雷数
			getOwnMineNum:function(xx,yy){
				//console.log(xx);
				//console.log(yy);
				
				var num = 0;//类的数量
				//一会封装它
				var posArray=this.stupidLogic(xx,yy);
				//console.log(this.stupidLogic(xx,yy));
				
				
				var chooseBtn = [];
				for(var i=0;i<posArray.length;i++){
					chooseBtn[i] = Ext.getCmp(posArray[i][0]+""+posArray[i][1]);
				}
				
				for(var i=0;i<chooseBtn.length;i++){
					if(chooseBtn[i].isMine){
						num++;
					};	
				}
				return num;		
			},
			//[xx-1,yy-1][xx-1,yy][xx-1,yy+1][xx,yy-1][xx,yy+1][xx+1,yy-1][xx+1,yy][xx+1,yy+1]				
			//这个我写过的最笨的逻辑。。没有之一
			stupidLogic:function(xx,yy){
				var posArray=[];
				//xx-1=0，说明是xx在最上轴没有[xx-1,yy-1][xx-1,yy][xx-1,yy+1]这三项
				if(xx-1==0){
					//没有  [xx,yy-1][xx+1,yy-1]和（第一层就出去的[xx-1,yy-1]）这三项，
					if(yy-1==0){
						posArray=[[xx,yy+1],[xx+1,yy],[xx+1,yy+1]];
						
					}else if(yy+1==11){
						posArray =[[xx,yy-1],[xx+1,yy-1],[xx+1,yy]];
					
					}else{
						posArray =[[xx,yy-1],[xx+1,yy-1],[xx+1,yy],[xx,yy+1],[xx+1,yy+1]];
					}
				}else if(xx+1==11){
					if(yy-1==0){
						posArray=[[xx-1,yy],[xx-1,yy+1],[xx,yy+1]];									
					}else if(yy+1==11){
						posArray =[[xx-1,yy-1],[xx-1,yy],[xx,yy-1]];								
					}else{
						posArray =[[xx-1,yy-1],[xx,yy-1],[xx-1,yy],[xx-1,yy+1],[xx,yy+1]];
					}
				}else{
					if(yy-1==0){
						posArray=[[xx-1,yy],[xx+1,yy],[xx-1,yy+1],[xx,yy+1],[xx+1,yy+1]];									
					}else if(yy+1==11){
						posArray =[[xx-1,yy-1],[xx,yy-1],[xx+1,yy-1],[xx-1,yy],[xx+1,yy]];						
					}else{
						posArray =[[xx-1,yy-1],[xx-1,yy],[xx-1,yy+1],[xx,yy-1],[xx,yy+1],[xx+1,yy-1],[xx+1,yy],[xx+1,yy+1]];
					}
				}
				return posArray;
			}
			
		});

		function fn(e){
			//console.log(e);
			e.preventDefault();
			//背景图片改变
			var btn1 = document.getElementById(id);
			//console.dir(btn1);
			//添加class,若样式冲突切权重相同，不看先后添加class顺序，而看2个class在css文件的位置，靠后面的class胜出。。
			btn1.childNodes[0].childNodes[0].className += ' btnContext';
			//btn1.childNodes[0].childNodes[0].style.background='url(./resouces/image/flag.png)';
		}
		setTimeout(function(){
			var btn1 = document.getElementById(id);
			myLib.addEvent(btn1,'contextmenu',fn);
		},0)
		
		return btn;
	},


	//需要一个雷的数组和一个btn的数组
	checkIsWin:function(MineArray,btnArry){
		var total = 100;
		var mimeNum = 0;
		var btnClkNum =0;
		for(var i=0;i<MineArray.length;i++){
			if(MineArray[i]){
				mimeNum++;
			}
			if(btnArry[i].isClicked){
				btnClkNum++;
			}
		}
		if(total==(mimeNum+btnClkNum)){
			Ext.Msg.alert('好吧，我承认你赢了');
		}
		return [mimeNum,btnClkNum];
	},

	
});
