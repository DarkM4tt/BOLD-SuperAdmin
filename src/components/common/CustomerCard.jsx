import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";

const CustomerCard = ({ image, name, email, contact, rating }) => {
  return (
    <div className="bg-white rounded-lg px-6 pt-4 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt="Customer"
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <p className="text-2xl font-semibold text-black">
            {name || "No name"}
          </p>

          <div className="flex flex-col text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <EmailIcon fontSize="small" sx={{ color: "gray" }} />
              <p className="text-gray underline font-normal text-base">
                {email || "No email provided yet!"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <PhoneIcon fontSize="small" sx={{ color: "gray" }} />
              <p className="text-gray underline font-normal text-base">
                {contact || "No contact provided yet!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-redhat text-xl font-normal text-gray">
          Customer rating
        </p>
        <div className="flex items-center gap-1 mt-1">
          <StarIcon fontSize="medium" sx={{ color: "#FBDB0B" }} />
          <span className="text-boldCyan font-redhat font-bold text-lg">
            {rating}/5
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
