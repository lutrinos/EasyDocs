
export type BannerOption = {
  id: string;
  title: string;
  color: string;
  background: string;

  visibility?: 'persistent' | 'removable';
  url?: string;
  icon?: string;
};

export const Banner = ({ id, title, background, color, icon, url, visibility }: BannerOption) => {
  return (
    <div class="banner" style={{ background: background ?? 'var(--primary-dimmest)', color: color ?? 'var(--background)' }}>
      <div>
        <p>{ title }</p>
      </div>
    </div>
  );
}