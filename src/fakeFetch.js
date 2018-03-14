const defaultResult = { status: 404, message: 'not found', pattern: /^\/$/ };

const fetchify = result => ({
  ...result,
  json: ()=> Promise.resolve( result.body ),
});

export default new (class FakeFetch {
  mocks = {}
  oldFetch = window.fetch
  
  fetch = window.fetch = (...args) =>
    Promise.resolve(
      Object.keys(this.mocks)
            .find( mock=> this.mocks[mock].pattern.exec(args[0]) ) ||
      this.oldFetch(...args)
    ).then( result => this.mocks[result] ? fetchify(this.mocks[result]) : result
    ).then( result => (result.callback && result.callback(...args), result ) )
  
  loadMock = (name, result=defaultResult)=>
    this.mocks[name] || (this.mocks[name] = result)

  unloadMock = name => {
    delete this.mocks[name];
    if( !Object.keys(this.mocks).length ) window.fetch = this.oldFetch;
  }
});
