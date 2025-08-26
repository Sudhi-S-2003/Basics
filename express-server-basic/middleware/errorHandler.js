const errorHandler=(fn)=>{
    fn().then().error(
        next()
    )
}