import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Music } from "lucide-react";
import { useNavigate, useParams } from 'react-router';
import axiosClient from '../api/axiosClient';
import { useUser } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Event = () => {
  const params = useParams();

  const { user, userLoading } = useUser();

  const id = params.eventId;

  const [event, setEvent] = useState(null);


  const navigate = useNavigate();

  const handleOrderClick = async (e) => {
    if (event.amountPerPerson === 0) {
      await Swal.fire({
        toast: true,
        title: "Please wait while we Register You....",
        icon: "info",
        position: 'top',
        timer: 6000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      const response = await axiosClient.post("/registerEvent", { user, event });
      const result = response.data;

      await Swal.fire({
        toast: true,
        title: result.msg,
        icon: result.success ? "success" : "error",
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      navigate('/');

    } else {
      let amount = event.amountPerPerson.toFixed(2).toString();
      // "699.99"
      // [0] = 699 [1] = 99;
      // amount 
      amount = amount.split(".")[0] + amount.split(".")[1];
      amount = Number(amount);

      const res = await axiosClient({
        method: "post",
        data: { amount, currency: "INR" },
        url: "/orders/create"
      });

      const response2 = res.data;

      const options = {
        "key": response2.key,
        "amount": amount,
        "currency": "INR",
        "name": "CU LIVE",
        "order_id": response2.order_id,
        "handler": async function (response) {
          try {
            const storeRazorpayFields = await axiosClient.post("/razorpaySign", {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              sign: response.razorpay_signature
            });

            const resData = storeRazorpayFields.data;

            if (resData.success) {
              await Swal.fire({
                position: "top",
                timer: 800,
                timerProgressBar: false,
                showConfirmButton: false,
                showCancelButton: false,
                title: "Your Payment is Received, we will Register you",
                icon: "success",
                toast: true
              });

              await Swal.fire({
                toast: true,
                title: "Please wait while we Register You....",
                icon: "info",
                position: 'top',
                timer: 8000,
                timerProgressBar: true,
                showConfirmButton: false
              });
              const response = await axiosClient.post("/registerEvent", { user, event });
              const result = response.data;

              await Swal.fire({
                toast: true,
                title: result.msg,
                icon: result.success ? "success" : "error",
                position: 'top',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
              });

              navigate('/');

            } else {
              await Swal.fire({
                title: "Unable to process your payment, Any deduction will be refunded within 7 working days",
                position: "center",
                showConfirmButton: true,
                icon: "warning",
                timer: 5000,
                timerProgressBar: true,
              });

              navigate("/");
            }

          } catch (e) {
            console.error(e);

            await Swal.fire({
              title: "Error while parsing Payment",
              icon: 'error',
              position: 'top',
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
              timerProgressBar: true
            });

            return;
          }
        },
        "theme": {
          "color": "#3399cc"
        }
      };

      let rzp1 = new Razorpay(options);
      rzp1.open();

      rzp1.on('payment.failed', async function (res) {
        await Swal.fire({
          position: "top",
          title: res.error.description,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: false,
          icon: "error",
        });

        return;
      });

      e.preventDefault();
    }
  }

  useEffect(() => {
    let fetchEvent = async () => {
      const res = await axiosClient.get(`/events/${id}`);
      const event = res.data.data;
      return event;
    }

    fetchEvent().then((event) => {
      setEvent(event);

      console.log(event);
    }).catch((e) => {
      console.error(e);
    });

    const script = document.createElement("script");
    script.src = import.meta.env.VITE_RAZORPAY_SRC;
    script.async = true;
    document.body.appendChild(script);

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-[linear-gradient(to_right,#1e3a8a,#000000)] min-h-[60vh] relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Event Info */}
            <div className="text-white space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold">
                  <span className="text-green-400">{event && event.title}</span>
                  <span className="block text-3xl mt-2">{event && event.extraTitle}</span>
                </h1>

              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  <span>{event && event.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{event && event.date} </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event && event.location}</span>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleOrderClick} className="bg-green-400 text-black px-8 py-6 text-lg rounded-lg hover:bg-green-500">
                  BOOK TICKETS
                </button>
              </div>
            </div>

            {/* Right Side - Pricing Card */}
            <div className="bg-white/10 backdrop-blur-lg text-white rounded-lg border border-white/20">
              <div className="p-6 space-y-4">
                {event && <div className="text-center space-y-2">
                  <p className="text-xl">Ticket Pricing</p>
                  <p className="text-4xl font-bold">Get at {event.amountPerPerson} only!</p>
                </div>}

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sponsors Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Event Partners</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">Powered By</p>
                <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                  Chandigarh University
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">DCP Partner</p>
                <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                  AJIO
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">F&B Partner</p>
                <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                  X Food
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">Radio Partner</p>
                <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                  Mirchi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">About the Event</h2>
          <p className="text-gray-600">
            {event && event.about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Event;