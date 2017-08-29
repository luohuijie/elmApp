/**
 * Created by Administrator on 2017/4/16.
 */
export function saveStore(id,key,value){
  let seller = window.localStorage.__seller__;
  if( !seller){
    seller = {}
    seller[id]={}
  }else{
    seller = JSON.parse(seller);
    if(!seller.id){
      seller[id]={}
    }
  };
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};
export function loadStroe(id,key,def) {
  let seller = window.localStorage.__seller__;
  if(!seller){
    return def;
  };
   seller = JSON.parse(seller)[id];
  if(!seller){
    return def;
  };

  let response = seller[key];
  return response || def;
};
