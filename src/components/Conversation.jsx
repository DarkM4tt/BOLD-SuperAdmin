import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography, Modal } from "@mui/material";
import { useFetchRideDetailsQuery } from "../services/rideApi";
import { useFetchChatsQuery } from "../services/chatApi";
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
  const [openImage, setOpenImage] = useState(null);

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
        {rideError?.data?.message || "Error loading data "}
      </p>
    );
  }

  if (isRideLoading) {
    return <LoadingAnimation height={500} width={500} />;
  }

  return (
    <>
      <p className="font-redhat font-semibold text-base flex items-center">
        <span className="text-[#777777] pr-1">
          {"Dashboard > Ride details"}
        </span>
        {"> Chat history"}
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

          <div className="flex justify-between items-center mt-4 mx-8">
            <p className="font-redhat text-xl font-semibold">
              Driver ({rideData?.driver_info?.full_name}) ↓
            </p>
            <p className="font-redhat text-xl font-semibold">
              Customer ({rideData?.customer_info?.full_name}) ↓
            </p>
          </div>

          <Paper
            sx={{
              width: "100%",
              height: "600px",
              overflowY: "auto",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
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
                    flexDirection: "column",
                    alignItems: alignRight ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "65%",
                      backgroundColor: alignRight ? "#e0e0e0" : "#18C4B8",
                      color: alignRight ? "#000" : "#fff",
                      px: 2,
                      py: 1.5,
                      borderRadius: "10px",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg?.attachment ? (
                      msg.attachment.attachment.endsWith(".jpg") ||
                      msg.attachment.attachment.endsWith(".png") ? (
                        <img
                          src={msg.attachment.attachment}
                          alt="attachment"
                          className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                          onClick={() =>
                            setOpenImage(msg.attachment.attachment)
                          }
                        />
                      ) : (
                        <a
                          href={msg.attachment.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download File
                        </a>
                      )
                    ) : (
                      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                        {msg.text}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color: "#8c8c8c",
                      mt: 0.5,
                      alignSelf: alignRight ? "flex-end" : "flex-start",
                    }}
                  >
                    {format(new Date(msg?.send_at), "dd MMM, yyyy h:mm a")}
                  </Typography>
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
      ) : loading ? (
        <CircularProgress size={20} />
      ) : (
        <p className="p-6 text-lg font-redhat font-bold text-red-400">
          No chats for this ride!
        </p>
      )}

      <Modal
        open={Boolean(openImage)}
        onClose={() => setOpenImage(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ outline: "none" }}>
          <img
            src={openImage}
            alt="Full Size"
            className="max-h-[60vh] max-w-[60vw] rounded-lg"
          />
        </Box>
      </Modal>
    </>
  );
};

export default Conversation;
