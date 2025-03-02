export const Brand = ({ title, icon }) => {
  return (
    <div class="brand">
      {icon && (
        <img
          alt={icon.alt}
          src={icon.src}
          width={icon.width}
          height={icon.height}
        />
      )}
      {title && <h1 class="title">{title}</h1>}
    </div>
  );
};
