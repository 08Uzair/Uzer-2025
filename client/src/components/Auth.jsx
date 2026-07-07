import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategory } from "../redux/actions/category";
import { authSignIn, authSignUp } from "../redux/actions/auth";
import { uploadImageToCloudinary } from "../utilty/uploadToCloudinary";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Validation helpers ─────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// At least 8 chars, one letter, one number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const validateEmail = (value) => {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
  return "";
};

const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (!PASSWORD_REGEX.test(value))
    return "Min 8 characters, with at least 1 letter and 1 number";
  return "";
};

const validateName = (value) => {
  if (!value.trim()) return "Username is required";
  if (value.trim().length < 3) return "Username must be at least 3 characters";
  if (value.trim().length > 30) return "Username must be under 30 characters";
  if (!/^[a-zA-Z0-9 _.-]+$/.test(value.trim()))
    return "Only letters, numbers, spaces, . _ - are allowed";
  return "";
};

// ─── Shared input field ──────────────────────────────────────────────────
const Field = ({ label, error, icon: Icon, children }) => (
  <div>
    <label className="block text-sm font-medium text-white/60 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
      )}
      {children}
    </div>
    {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
  </div>
);

const inputClass = (hasError, withIcon = true) =>
  `w-full rounded-xl py-2.5 ${
    withIcon ? "pl-9" : "px-3.5"
  } pr-3.5 text-sm text-white bg-white/5 border placeholder:text-white/25 focus:outline-none transition-colors ${
    hasError
      ? "border-red-500/60 focus:border-red-500"
      : "border-white/10 focus:border-white/30"
  }`;

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadImage = await uploadImageToCloudinary(file);
        setImage(uploadImage);
        return true;
      } catch (err) {
        toast.error("Image upload failed, please try again");
        return false;
      }
    }
    return false;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = { name, email, password, image, bio, category };
      await dispatch(authSignUp(newUser));
      toast.success("Account created successfully 😊");
      navigate("/");
    } catch (error) {
      console.error("Sign Up Error:", error);
      toast.error("Sign up failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = { email, password };
      await dispatch(authSignIn(user));
      navigate("/");
    } catch (error) {
      console.error("Sign In Error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/15 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div className="p-8 pb-0">
          <h1 className="text-2xl font-semibold text-white text-center mb-1">
            {isSignIn ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-white/40 text-sm text-center mb-6">
            {isSignIn
              ? "Sign in to continue to your account"
              : "Join the community and start writing"}
          </p>

          <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                isSignIn
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                !isSignIn
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="p-8">
          {isSignIn ? (
            <SignInForm
              handleSignIn={handleSignIn}
              setEmail={setEmail}
              setPassword={setPassword}
              loading={loading}
            />
          ) : (
            <SignUpForm
              handleSignUp={handleSignUp}
              setName={setName}
              setEmail={setEmail}
              setPassword={setPassword}
              setBio={setBio}
              setCategory={setCategory}
              handleImageUpload={handleImageUpload}
              loading={loading}
              cat={cat}
              hasImage={!!image}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sign In ──────────────────────────────────────────────────────────────
const SignInForm = ({ handleSignIn, setEmail, setPassword, loading }) => {
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const onSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateEmail(emailVal);
    const passwordErr = !passwordVal.trim() ? "Password is required" : "";
    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }
    handleSignIn(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" error={errors.email} icon={Mail}>
        <input
          type="email"
          value={emailVal}
          onChange={(e) => {
            setEmailVal(e.target.value);
            setEmail(e.target.value);
            clearError("email");
          }}
          className={inputClass(errors.email)}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Password" error={errors.password} icon={Lock}>
        <input
          type={showPassword ? "text" : "password"}
          value={passwordVal}
          onChange={(e) => {
            setPasswordVal(e.target.value);
            setPassword(e.target.value);
            clearError("password");
          }}
          className={inputClass(errors.password) + " pr-10"}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
      >
        {loading && (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
        )}
        {loading ? "Signing In…" : "Sign In"}
      </button>
    </form>
  );
};

// ─── Sign Up ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Account" },
  { id: 2, label: "Security" },
  { id: 3, label: "Profile" },
];

const SignUpForm = ({
  handleSignUp,
  setName,
  setEmail,
  setPassword,
  setBio,
  setCategory,
  handleImageUpload,
  loading,
  cat,
  hasImage,
}) => {
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [nameVal, setNameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [categoryVal, setCategoryVal] = useState("");
  const [bioVal, setBioVal] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const BIO_MAX = 200;

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const validateStep1 = () => {
    const next = {
      name: validateName(nameVal),
      email: validateEmail(emailVal),
    };
    setErrors((prev) => ({ ...prev, ...next }));
    return next;
  };

  const validateStep2 = () => {
    const next = {
      password: validatePassword(passwordVal),
      confirmPassword:
        confirmPassword !== passwordVal ? "Passwords do not match" : "",
      image: hasImage || previewImage ? "" : "Please upload a profile image",
    };
    setErrors((prev) => ({ ...prev, ...next }));
    return next;
  };

  const validateStep3 = () => {
    const next = {
      category: !categoryVal ? "Please select a category" : "",
      bio:
        bioVal.trim().length > BIO_MAX
          ? `Bio must be under ${BIO_MAX} characters`
          : "",
    };
    setErrors((prev) => ({ ...prev, ...next }));
    return next;
  };

  const nextStep = () => {
    const next = step === 1 ? validateStep1() : validateStep2();
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields to continue");
      return;
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFileChange = async (file) => {
    if (!file) return;
    setUploading(true);
    const fakeEvent = { target: { files: [file] } };
    const ok = await handleImageUpload(fakeEvent);
    setUploading(false);
    if (!ok) return;

    clearError("image");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFileChange(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onFinalSubmit = (e) => {
    e.preventDefault();
    const next = validateStep3();
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields to continue");
      return;
    }
    handleSignUp(e);
  };

  return (
    <form onSubmit={onFinalSubmit} className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2.5 mb-2">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                  step === s.id
                    ? "bg-white text-black"
                    : step > s.id
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/30 border border-white/10"
                }`}
              >
                {step > s.id ? <Check size={12} /> : s.id}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  step === s.id ? "text-white" : "text-white/35"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-6 h-px ${
                  step > s.id ? "bg-white/40" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <>
          <Field label="Username" error={errors.name} icon={User}>
            <input
              type="text"
              value={nameVal}
              onChange={(e) => {
                setNameVal(e.target.value);
                setName(e.target.value);
                clearError("name");
              }}
              className={inputClass(errors.name)}
              placeholder="Enter username"
            />
          </Field>

          <Field label="Email" error={errors.email} icon={Mail}>
            <input
              type="email"
              value={emailVal}
              onChange={(e) => {
                setEmailVal(e.target.value);
                setEmail(e.target.value);
                clearError("email");
              }}
              className={inputClass(errors.email)}
              placeholder="you@example.com"
            />
          </Field>

          <button
            type="button"
            onClick={nextStep}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            Next
            <ArrowRight size={15} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <Field label="Password" error={errors.password} icon={Lock}>
            <input
              type={showPassword ? "text" : "password"}
              value={passwordVal}
              onChange={(e) => {
                setPasswordVal(e.target.value);
                setPassword(e.target.value);
                clearError("password");
              }}
              className={inputClass(errors.password) + " pr-10"}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <Field
            label="Confirm Password"
            error={errors.confirmPassword}
            icon={Lock}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError("confirmPassword");
              }}
              className={inputClass(errors.confirmPassword)}
              placeholder="Re-enter your password"
            />
          </Field>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Profile Image
            </label>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => document.getElementById("fileInput").click()}
              className={`rounded-xl border-2 border-dashed py-6 px-3 text-center cursor-pointer flex items-center justify-center transition-all ${
                dragActive
                  ? "border-white/40 bg-white/[0.06]"
                  : errors.image
                    ? "border-red-500/50 hover:border-red-500/70"
                    : "border-white/15 hover:border-white/30 bg-white/[0.02]"
              }`}
            >
              {uploading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-full border border-white/15"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud size={20} className="text-white/30" />
                  <p className="text-white/40 text-sm">
                    Drag and drop or click to upload
                  </p>
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>
            {errors.image && (
              <p className="text-red-400 text-xs mt-1.5">{errors.image}</p>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              Next
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Field label="Category" error={errors.category}>
            <select
              value={categoryVal}
              onChange={(e) => {
                setCategoryVal(e.target.value);
                setCategory(e.target.value);
                clearError("category");
              }}
              className={inputClass(errors.category, false)}
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-[#111]">
                Select category
              </option>
              {cat?.map((item) => (
                <option key={item._id} value={item._id} className="bg-[#111]">
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-white/60">
                Bio
              </label>
              <span
                className={`text-xs ${
                  bioVal.length > BIO_MAX ? "text-red-400" : "text-white/30"
                }`}
              >
                {bioVal.length}/{BIO_MAX}
              </span>
            </div>
            <textarea
              value={bioVal}
              onChange={(e) => {
                setBioVal(e.target.value);
                setBio(e.target.value);
                clearError("bio");
              }}
              rows={3}
              className={inputClass(errors.bio, false) + " resize-none"}
              placeholder="Tell us about yourself"
            />
            {errors.bio && (
              <p className="text-red-400 text-xs mt-1.5">{errors.bio}</p>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              )}
              {loading ? "Signing Up…" : "Sign Up"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default Auth;
