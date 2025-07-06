import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const checkOutControllers = asyncHandler(async (req, res) => {
    const { price } = req.body;
    if (!price) {
        throw new ApiError(false, 400, "User must Provide price and user");
    }
    //   const userDocument = await User.findById(user._id).select("-password");
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "ChatA.I Premium",
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success",
    });
    return res.status(200).json(new ApiResponse(true, 200, "Sessions created successfully", {
        id: session.id,
    }));
});
export { checkOutControllers };
