import Subscription from "../model/subscription.model.js";

export class SubscriptionController {
    async create(req, res) {
        try {
            const newSubs = await Subscription.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: newSubs,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message:  "interval serever error",
            });
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const updatingSubscription = await Subscription.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                }
            );
            if (!updatingSubscription) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Subscription is not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatingSubscription,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const deletedSubscription = await Subscription.findByIdAndDelete(id);
            if (!deletedSubscription) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Subscription is not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: {},
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval serever error",
            });
        }
    }
}