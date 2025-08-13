export const errorHandle = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = {
            status: error.status || 500,
            error: error.message || 'Internal server error'
        };
        ctx.app.emit('error', error, ctx);
    }
};