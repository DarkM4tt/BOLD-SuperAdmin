import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useFetchRideDetailsQuery } from "../features/rideApi";
import { useFetchChatsQuery } from "../features/chatApi";
import { format } from "date-fns";
import LoadingAnimation from "./common/LoadingAnimation";
import BackArrow from "../assets/backArrow.svg";

const Conversation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const { rideId, chatId } = params;
  const {
    data: tripData,
    error: rideError,
    isLoading: isRideLoading,
  } = useFetchRideDetailsQuery(rideId);
  const rideData = tripData?.data;
  const [allMessages, setAllMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { data: chatData, isFetching: loading } = useFetchChatsQuery({
    chatId,
    page,
  });
  const { results = [], isNextPage } = chatData?.data?.messages || {};

  useEffect(() => {
    if (results.length > 0) {
      setAllMessages((prev) => [...prev, ...results]);
    }
    setIsFetching(false);
  }, [chatData]);

  const handleScroll = useCallback(() => {
    const scrollDiv = chatContainerRef.current;
    if (!scrollDiv || isFetching || !isNextPage) return;

    const nearBottom =
      scrollDiv.scrollTop + scrollDiv.clientHeight >=
      scrollDiv.scrollHeight - 100;

    if (nearBottom) {
      setIsFetching(true);
      setPage((prev) => prev + 1);
    }
  }, [isFetching, isNextPage]);

  useEffect(() => {
    const chatDiv = chatContainerRef.current;
    if (chatDiv) {
      chatDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatDiv) {
        chatDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const driverId = rideData?.driver_info?.id;
  const customerId = rideData?.customer_info?.id;

  const isDriver = (sender) => sender === driverId;
  const isCustomer = (sender) => sender === customerId;

  if (rideError) {
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {rideError?.data?.message || "Error loading data "}{" "}
      </p>
    );
  }

  if (isRideLoading) {
    return <LoadingAnimation height={500} width={500} />;
  }

  return (
    <>
      <p className="font-redhat font-semibold text-base flex items-center">
        <span className="text-[#777777] pr-1">{"Dashboard > Rides"}</span>
        {"> Ride details > Chat"}
      </p>

      <div className="flex items-center gap-4 mt-8">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="font-redhat font-semibold text-2xl">
          Customer / Driver chat history
        </p>
      </div>
      {results?.length > 0 ? (
        <>
          <p className="ml-10 text-[#777777] font-redhat font-normal text-base">
            This conversation is only between {rideData?.driver_info?.full_name}{" "}
            & {rideData?.customer_info?.full_name}
          </p>

          <Paper
            sx={{
              width: "100%",
              height: "600px",
              overflowY: "auto",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              borderRadius: "8px",
              marginTop: "20px",
              backgroundColor: "#E8E8E8",
              boxShadow: "none",
            }}
            ref={chatContainerRef}
          >
            {allMessages?.map((msg, idx) => {
              const isDriverMsg = isDriver(msg.sender);
              const isCustomerMsg = isCustomer(msg.sender);
              const alignRight =
                isCustomerMsg || (!isDriverMsg && !isCustomerMsg);

              return (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: alignRight ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "65%",
                      backgroundColor: alignRight ? "#e0e0e0" : "#18C4B8",
                      color: alignRight ? "#000" : "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                      {msg.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        fontSize: "0.6rem",
                        opacity: 0.6,
                        mt: 0.5,
                      }}
                    >
                      {format(new Date(msg?.send_at), "dd MMM, yyyy h:mm a")}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {(isFetching || loading) && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Paper>
        </>
      ) : (
        <p className="p-6 text-lg font-redhat font-bold text-red-400">
          No chats for this ride!
        </p>
      )}
    </>
  );
};

export default Conversation;
