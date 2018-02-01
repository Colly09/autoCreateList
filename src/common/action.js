export const handleListClick = (button, data) => {
  console.log(button, data);
  if (button.confirm) {
    this.$confirm(button.confirm, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      doAction(button, data)
    }).catch(() => {
    });
  } else {
    doAction(button, data)
  }
}

export const doAction = (button, data) => {
  if (button.type == 'ajax') {
    if (!this.$selfConfig.listConfig.ajaxUri) {
      this.$confirm('请配置Ajax请求地址', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'error'
      }).catch(() => {
      });
      return;
    }
    let post = {
      act: button.action,
      ajaxUri: this.$selfConfig.listConfig.ajaxUri,
      data: JSON.stringify(data)
    }
    this.$store.dispatch('doAjax', post).then(body => {
      handleBody(body);
    });
  } else {
    window.operate(button.action, data);
  }
}

export const handleBody = (body) => {
  if (body.code != 1000) {
    this.$confirm(body.msg, '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      type: 'error'
    }).catch(() => {
    });
  } else {
    this.$confirm(body.msg, '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      type: 'success'
    }).catch(() => {
    });
  }
}
