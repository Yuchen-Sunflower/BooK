// pages/address_sel/address_sel.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],//存储获取的用户地址信息
    openid:'',
    id:'',
    state:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  defaultFun:function(data){
    //将目前为true的改为false，将item.default改为true
    let that = this
    wx.cloud.init()
    var db = wx.cloud.database()
    var  _ = db.command
    db.collection("address").where({
      default:true
    }).get({
      success:(res)=>{
        db.collection("address").doc(res.data[0]._id).update({
          data:{
            default:false
          }
        })
      }
    })
    db.collection("address").where({
      id:data.currentTarget.dataset.item.id
    }).get({
      success:(res)=>{
        db.collection("address").doc(res.data[0]._id).update({
          data:{
            default:true
          }
        })
      }
    })
    that.setData({
      id : data.currentTarget.dataset.item.id
    })
  },

  delfun:function(data){
    let that = this
    wx.cloud.init()
    var db = wx.cloud.database()
    var  _ = db.command
    db.collection("address").where({
      id:data.currentTarget.dataset.item.id
    }).get({
      success:(res)=>{
        db.collection("address").doc(res.data[0]._id).remove({
          success: function(res) {
            console.log(res.data)
            that.onShow()
          }
        })
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      openid:app.globalData.openid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //在数据库获取用户的地址信息和默认地址信息
      let that = this
      wx.cloud.init()
      wx.cloud.database().collection("address").where({
        _openid:that.data.openid
      }).get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            list: res.data
          })
          console.log("赋值",that.data.list)
          for (var index in that.data.list){
            if(that.data.list[index].default == true){
              that.setData({
                id : that.data.list[index].id
              })
            }
          }
        },
        fail(res){
          console.log("请求失败", res)
        }
      })
    }
})